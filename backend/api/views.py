from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import datetime, timedelta
from django.db.models import Sum
import json
import csv
import os
from django.http import HttpResponse
from django.conf import settings

# YouTube API imports
import googleapiclient.discovery
from googleapiclient.errors import HttpError

from .serializers import UserSerializer, NoteSerializer
from .models import Note, Channel, Video
from django.core.management import call_command
from .youtube_service import YouTubeService


# ==============================================
# USER MANAGEMENT
# ==============================================

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        profile_data = {
            "username": user.username,
            "email": user.email,
            "fullName": f"{user.first_name} {user.last_name}".strip(),
            "bio": user.profile.bio if hasattr(user, 'profile') else ""
        }
        return Response(profile_data)
        
    def put(self, request):
        user = request.user
        data = request.data
        
        # Parse fullName into first_name and last_name
        full_name = data.get("fullName", "").strip()
        if full_name:
            parts = full_name.split(" ", 1)
            user.first_name = parts[0]
            user.last_name = parts[1] if len(parts) > 1 else ""
            
        if "username" in data:
            user.username = data["username"]
        if "email" in data:
            user.email = data["email"]
            
        user.save()
        
        if hasattr(user, 'profile') and "bio" in data:
            user.profile.bio = data["bio"]
            user.profile.save()
            
        return Response({"message": "Profile updated successfully"})


# ==============================================
# NOTES MANAGEMENT
# ==============================================

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user).order_by('-created_at')

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteUpdateView(generics.UpdateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    queryset = Note.objects.all()
    
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


# ==============================================
# YOUTUBE DASHBOARD VIEW (Database Driven)
# ==============================================

class YouTubeDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        channel_id = request.GET.get('channel_id')
        period = request.GET.get('period', 'last30days')
        
        if not channel_id:
            return Response({
                "error": "channel_id is required",
                "api_status": "error"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            channel = Channel.objects.get(youtube_channel_id=channel_id, user=request.user)
        except Channel.DoesNotExist:
            try:
                # Auto-sync if not found
                call_command('sync_youtube_data', channel_id=channel_id, username=request.user.username)
                channel = Channel.objects.get(youtube_channel_id=channel_id, user=request.user)
            except Exception as e:
                import traceback
                traceback.print_exc()
                return Response({
                    "error": "Channel not found and could not be synced automatically.",
                    "api_status": "error"
                }, status=status.HTTP_404_NOT_FOUND)
        
        # Calculate date range
        end_date = timezone.now().date()
        if period == "last7days":
            start_date = end_date - timedelta(days=7)
        elif period == "last90days":
            start_date = end_date - timedelta(days=90)
        else:
            start_date = end_date - timedelta(days=30)
        
        # Get videos
        videos = Video.objects.filter(
            channel=channel,
            published_at__date__gte=start_date,
            published_at__date__lte=end_date
        )
        
        # Calculate statistics
        total_views = videos.aggregate(total=Sum('view_count'))['total'] or 0
        total_likes = videos.aggregate(total=Sum('like_count'))['total'] or 0
        total_comments = videos.aggregate(total=Sum('comment_count'))['total'] or 0
        total_videos = videos.count()
        
        # Get top videos
        top_videos_data = []
        for video in videos.order_by('-view_count')[:5]:
            top_videos_data.append({
                "id": video.youtube_video_id,
                "title": video.title,
                "description": video.description[:150] if video.description else "",
                "views": video.view_count,
                "likes": video.like_count,
                "comments": video.comment_count,
                "thumbnail": video.thumbnail_url,
                "published_at": video.published_at.isoformat() if video.published_at else None
            })
        
        # Calculate metrics
        engagement_rate = (total_likes / total_views * 100) if total_views > 0 else 0
        estimated_watch_time = (total_views * 5) / 60 if total_views > 0 else 0
        estimated_revenue = (total_views / 1000) * 2 if total_views > 0 else 0
        avg_video_views = total_views // total_videos if total_videos > 0 else 0
        
        response_data = {
            "channel_info": {
                "title": channel.channel_name,
                "description": channel.description[:200] if channel.description else "",
                "thumbnail": channel.thumbnail_url,
                "custom_url": channel.channel_url,
            },
            "statistics": {
                "total_views": total_views,
                "subscribers": channel.subscriber_count,
                "total_videos": channel.video_count,
            },
            "quick_metrics": {
                "engagement_rate": round(engagement_rate, 2),
                "estimated_watch_time": round(estimated_watch_time, 1),
                "estimated_revenue": round(estimated_revenue, 2),
                "avg_video_views": avg_video_views,
            },
            "top_videos": top_videos_data,
            "period": period,
            "api_status": "success",
            "channel_id": channel_id
        }
        
        return Response(response_data)


class VideoAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        channel_id = request.GET.get('channel_id')
        if not channel_id:
            return Response({"error": "channel_id required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            channel = Channel.objects.get(youtube_channel_id=channel_id, user=request.user)
            videos = Video.objects.filter(channel=channel).order_by('-view_count')[:20]
            
            videos_data = [{
                "id": v.youtube_video_id,
                "title": v.title,
                "views": v.view_count,
                "likes": v.like_count,
                "comments": v.comment_count,
                "thumbnail": v.thumbnail_url,
                "published_at": v.published_at.isoformat() if v.published_at else None
            } for v in videos]
            
            return Response({"videos": videos_data, "total": len(videos_data)})
        except Channel.DoesNotExist:
            return Response({"error": "Channel not found"}, status=status.HTTP_404_NOT_FOUND)


class ChannelManagementView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        channels = Channel.objects.filter(user=request.user, is_active=True)
        channels_data = [{
            "id": c.youtube_channel_id,
            "title": c.channel_name,
            "thumbnail": c.thumbnail_url,
            "statistics": {
                "subscribers": c.subscriber_count,
                "videos": c.video_count,
                "views": c.view_count
            }
        } for c in channels]
        
        return Response({"channels": channels_data, "total": len(channels_data)})

    def post(self, request):
        channel_id = request.data.get('channel_id')
        if not channel_id:
            return Response({"error": "channel_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            call_command('sync_youtube_data', channel_id=channel_id, username=request.user.username)
            return Response({"message": "Channel synced successfully"})
        except Exception as e:
            return Response({"error": f"Failed to sync channel: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SearchChannelsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        query = request.GET.get('q')
        max_results = int(request.GET.get('max_results', 10))
        
        if not query:
            return Response({"error": "No search query provided"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            youtube_service = YouTubeService()
            channels = youtube_service.search_channels(query, max_results=max_results)
            return Response({"channels": channels})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AnalyticsTrendsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({"message": "Analytics trends endpoint"})


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({"status": "ok", "message": "Dashboard summary"})


# ==============================================
# SYSTEM ENDPOINTS
# ==============================================

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({
        "status": "healthy",
        "timestamp": str(timezone.now())
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    return Response({
        "username": request.user.username,
        "notes_count": Note.objects.filter(author=request.user).count()
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_test(request):
    return Response({"status": "API is working"})