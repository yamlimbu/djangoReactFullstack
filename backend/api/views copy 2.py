from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import timedelta
import json
import csv
from django.http import HttpResponse

from .serializers import UserSerializer, NoteSerializer
from .models import Note


# ==============================================
# USER MANAGEMENT (Keep existing)
# ==============================================
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# ==============================================
# NOTES MANAGEMENT (Keep existing)
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


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


# ==============================================
# YOUTUBE ANALYTICS APIS (NEW)
# ==============================================
class YouTubeAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get comprehensive YouTube analytics data"""
        
        # Get query parameters
        period = request.GET.get('period', 'last30days')
        
        # Mock data - Replace with actual YouTube API integration
        analytics_data = {
            "total_views": 2400000,
            "subscribers": 154000,
            "subscribers_gained": 2340,
            "watch_time_hours": 45200,
            "avg_view_duration": "4:32",
            "engagement_rate": 8.7,
            "estimated_revenue": 4280.50,
            "total_videos": 128,
            "top_video": {
                "title": "How to Analyze Big Data with Python",
                "views": 245000,
                "likes": 12000
            },
            "period": period,
            "date_range": {
                "start": str(timezone.now().date() - timedelta(days=30)),
                "end": str(timezone.now().date())
            }
        }
        
        return Response(analytics_data)


class VideoPerformanceView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get top performing videos"""
        
        # Mock data - Replace with actual YouTube API
        videos = [
            {
                "id": "dQw4w9WgXcQ",
                "title": "Big Data Tutorial - Complete Guide 2024",
                "views": 245000,
                "likes": 12000,
                "comments": 842,
                "duration": "15:42",
                "ctr": 8.2,
                "impressions": 1500000,
                "published_at": "2024-01-10",
                "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
            },
            {
                "id": "xVlSeYg1kGQ",
                "title": "Machine Learning Pipeline Guide",
                "views": 189000,
                "likes": 9400,
                "comments": 621,
                "duration": "22:18",
                "ctr": 7.1,
                "impressions": 1200000,
                "published_at": "2024-01-15",
                "thumbnail": "https://i.ytimg.com/vi/xVlSeYg1kGQ/hqdefault.jpg"
            },
            {
                "id": "aBcDeFgHiJk",
                "title": "Data Visualization with Python",
                "views": 156000,
                "likes": 8200,
                "comments": 512,
                "duration": "18:33",
                "ctr": 6.8,
                "impressions": 980000,
                "published_at": "2024-01-20",
                "thumbnail": "https://i.ytimg.com/vi/aBcDeFgHiJk/hqdefault.jpg"
            }
        ]
        
        videos.sort(key=lambda x: x['views'], reverse=True)
        
        return Response({"videos": videos})


class AudienceDemographicsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get audience demographics data"""
        
        demographics = {
            "age_groups": [
                {"age_range": "18-24", "percentage": 25},
                {"age_range": "25-34", "percentage": 42},
                {"age_range": "35-44", "percentage": 18},
                {"age_range": "45-54", "percentage": 10},
                {"age_range": "55+", "percentage": 5}
            ],
            "gender": {
                "male": 68,
                "female": 32
            },
            "top_countries": [
                {"country": "United States", "viewers": 35, "code": "US"},
                {"country": "India", "viewers": 22, "code": "IN"},
                {"country": "United Kingdom", "viewers": 12, "code": "GB"},
                {"country": "Germany", "viewers": 8, "code": "DE"},
                {"country": "Canada", "viewers": 7, "code": "CA"}
            ],
            "devices": {
                "mobile": 58,
                "desktop": 32,
                "tablet": 8,
                "tv": 2
            }
        }
        
        return Response(demographics)


class RevenueAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get revenue analytics data"""
        
        period = request.GET.get('period', 'last30days')
        
        revenue_data = {
            "total_revenue": 4280.50,
            "estimated_monthly_revenue": 12841.50,
            "revenue_sources": {
                "adsense": 65,
                "channel_memberships": 15,
                "super_chats": 10,
                "merchandise": 8,
                "other": 2
            },
            "revenue_trend": [
                {"date": "2024-01-01", "revenue": 120.50},
                {"date": "2024-01-08", "revenue": 185.75},
                {"date": "2024-01-15", "revenue": 210.25},
                {"date": "2024-01-22", "revenue": 195.50},
                {"date": "2024-01-29", "revenue": 245.80}
            ],
            "cpm": 8.42,
            "rpm": 12.35
        }
        
        return Response(revenue_data)


class RealTimeAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get real-time analytics (last 60 minutes)"""
        
        current_time = timezone.now()
        
        realtime_data = {
            "current_live_viewers": 1420,
            "views_last_hour": 8420,
            "subscribers_last_hour": 42,
            "top_videos_currently": [
                {"title": "Live: Big Data Analysis", "viewers": 850},
                {"title": "Python Tutorial", "viewers": 320},
                {"title": "Data Science Q&A", "viewers": 250}
            ],
            "timestamp": str(current_time),
            "metrics": {
                "concurrent_viewers": 1420,
                "chat_messages": 842,
                "super_chats": 18,
                "likes": 1240
            }
        }
        
        return Response(realtime_data)


class ExportAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Export analytics data"""
        
        format_type = request.GET.get('format', 'json')
        
        data = {
            "total_views": 2400000,
            "subscribers": 154000,
            "revenue": 4280.50,
            "exported_at": str(timezone.now())
        }
        
        if format_type == 'csv':
            response = HttpResponse(content_type='text/csv')
            response['Content-Disposition'] = f'attachment; filename="youtube_analytics_{timezone.now().date()}.csv"'
            
            writer = csv.writer(response)
            writer.writerow(['Metric', 'Value'])
            for key, value in data.items():
                writer.writerow([key, value])
                
            return response
            
        elif format_type == 'json':
            response = HttpResponse(
                json.dumps(data, indent=2),
                content_type='application/json'
            )
            response['Content-Disposition'] = f'attachment; filename="youtube_analytics_{timezone.now().date()}.json"'
            return response
            
        else:
            return Response(data)


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get dashboard summary data"""
        
        summary = {
            "quick_stats": {
                "total_views": "2.4M",
                "subscribers": "154K",
                "watch_time": "45.2K",
                "revenue": "$4,280",
                "engagement": "8.7%",
                "videos": 128
            },
            "trending": {
                "views_trend": "+12.5%",
                "subscribers_trend": "+2.3K",
                "revenue_trend": "+18.3%",
                "watch_time_trend": "+8.7%"
            },
            "recent_activity": [
                {"type": "video_published", "title": "Big Data Tutorial", "time": "2 hours ago"},
                {"type": "milestone", "title": "Reached 150K subscribers", "time": "1 day ago"},
                {"type": "revenue", "title": "Monthly revenue: $4,280", "time": "2 days ago"}
            ]
        }
        
        return Response(summary)


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint"""
    return Response({
        "status": "healthy",
        "timestamp": str(timezone.now()),
        "service": "YouTube Analytics API",
        "version": "1.0.0"
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    """Get user statistics"""
    user = request.user
    
    # Get note count for the user
    note_count = Note.objects.filter(author=user).count()
    
    return Response({
        "username": user.username,
        "notes_count": note_count,
        "member_since": str(user.date_joined.date()),
        "last_login": str(user.last_login) if user.last_login else "Never"
    })