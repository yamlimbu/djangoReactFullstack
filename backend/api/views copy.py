from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from datetime import datetime, timedelta
import json
import csv
import os
from django.http import HttpResponse
from django.conf import settings

# YouTube API imports
import googleapiclient.discovery
import googleapiclient.errors
from googleapiclient.errors import HttpError
import requests

from .serializers import UserSerializer, NoteSerializer
from .models import Note


# ==============================================
# YOUTUBE API SERVICE SETUP
# ==============================================
def get_youtube_service():
    """Initialize YouTube API service"""
    api_key = getattr(settings, 'YOUTUBE_API_KEY', os.environ.get('YOUTUBE_API_KEY'))
    
    if not api_key:
        raise ValueError("YouTube API key not configured. Set YOUTUBE_API_KEY in settings or environment.")
    
    # Build the service
    youtube = googleapiclient.discovery.build(
        'youtube',
        'v3',
        developerKey=api_key,
        cache_discovery=False
    )
    
    return youtube


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

class NoteUpdateView(generics.UpdateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    queryset = Note.objects.all()
    
    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
class cccNoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user).order_by('-created_at')

    def list(self, request, *args, **kwargs):
        # This ensures we return a list
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)  # This should be an array
    
    
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
# YOUTUBE ANALYTICS APIS (UPDATED WITH REAL API)
# ==============================================
class YouTubeAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get comprehensive YouTube analytics data"""
        
        try:
            # Get parameters
            channel_id = request.GET.get('channel_id', 'UC-2Mn1v6KM5OCdr0mauE0Jg')  # Default: Google channel
            period = request.GET.get('period', 'last30days')
            
            # Initialize YouTube API
            youtube = get_youtube_service()
            
            # Get channel statistics
            channel_response = youtube.channels().list(
                part='statistics,snippet',
                id=channel_id
            ).execute()
            
            if not channel_response.get('items'):
                return Response({"error": "Channel not found"}, status=status.HTTP_404_NOT_FOUND)
            
            channel_data = channel_response['items'][0]
            stats = channel_data['statistics']
            snippet = channel_data['snippet']
            
            # Calculate date range
            end_date = datetime.now()
            if period == 'last7days':
                start_date = end_date - timedelta(days=7)
            elif period == 'last90days':
                start_date = end_date - timedelta(days=90)
            else:  # last30days default
                start_date = end_date - timedelta(days=30)
            
            # Get videos for this channel (limited to 50 for demo)
            videos_response = youtube.search().list(
                part='id',
                channelId=channel_id,
                maxResults=50,
                order='date',
                type='video'
            ).execute()
            
            video_ids = [item['id']['videoId'] for item in videos_response.get('items', [])]
            
            # Get video statistics if we have videos
            total_views = 0
            total_videos = int(stats.get('videoCount', 0))
            
            if video_ids:
                videos_stats = youtube.videos().list(
                    part='statistics,contentDetails',
                    id=','.join(video_ids[:10])  # Limit to 10 for performance
                ).execute()
                
                for video in videos_stats.get('items', []):
                    total_views += int(video['statistics'].get('viewCount', 0))
            
            # Prepare analytics data
            analytics_data = {
                "channel_info": {
                    "title": snippet.get('title', 'Unknown'),
                    "description": snippet.get('description', '')[:100] + "...",
                    "custom_url": snippet.get('customUrl', ''),
                    "published_at": snippet.get('publishedAt', ''),
                    "thumbnail": snippet.get('thumbnails', {}).get('high', {}).get('url', '')
                },
                "statistics": {
                    "total_views": int(stats.get('viewCount', 0)),
                    "subscribers": int(stats.get('subscriberCount', 0)),
                    "total_videos": total_videos,
                    "sample_views": total_views,  # Views from sampled videos
                },
                "period": period,
                "date_range": {
                    "start": start_date.strftime('%Y-%m-%d'),
                    "end": end_date.strftime('%Y-%m-%d')
                },
                "api_status": "success",
                "channel_id": channel_id
            }
            
            return Response(analytics_data)
            
        except HttpError as e:
            error_msg = f"YouTube API Error: {e.error_details if hasattr(e, 'error_details') else str(e)}"
            return Response({"error": error_msg}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VideoPerformanceView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get top performing videos"""
        
        try:
            channel_id = request.GET.get('channel_id', 'UC-2Mn1v6KM5OCdr0mauE0Jg')
            max_results = int(request.GET.get('max_results', 10))
            
            youtube = get_youtube_service()
            
            # Get videos from channel
            search_response = youtube.search().list(
                part='id,snippet',
                channelId=channel_id,
                maxResults=max_results,
                order='viewCount',  # Sort by view count
                type='video'
            ).execute()
            
            video_ids = [item['id']['videoId'] for item in search_response.get('items', [])]
            
            videos_data = []
            
            if video_ids:
                # Get detailed statistics for each video
                videos_response = youtube.videos().list(
                    part='statistics,contentDetails,snippet',
                    id=','.join(video_ids)
                ).execute()
                
                for video in videos_response.get('items', []):
                    video_info = {
                        "id": video['id'],
                        "title": video['snippet']['title'],
                        "description": video['snippet']['description'][:150] + "..." if len(video['snippet']['description']) > 150 else video['snippet']['description'],
                        "views": int(video['statistics'].get('viewCount', 0)),
                        "likes": int(video['statistics'].get('likeCount', 0)),
                        "comments": int(video['statistics'].get('commentCount', 0)),
                        "duration": video['contentDetails']['duration'],
                        "published_at": video['snippet']['publishedAt'],
                        "thumbnail": video['snippet']['thumbnails']['high']['url'],
                        "tags": video['snippet'].get('tags', [])[:5]  # First 5 tags
                    }
                    videos_data.append(video_info)
            
            # Sort by views (already sorted by API but ensure)
            videos_data.sort(key=lambda x: x['views'], reverse=True)
            
            return Response({"videos": videos_data, "total": len(videos_data)})
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChannelSearchView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Search for YouTube channels"""
        
        try:
            query = request.GET.get('q', '')
            max_results = int(request.GET.get('max_results', 10))
            
            if not query:
                return Response({"error": "Search query required"}, status=status.HTTP_400_BAD_REQUEST)
            
            youtube = get_youtube_service()
            
            # Search for channels
            search_response = youtube.search().list(
                part='snippet',
                q=query,
                maxResults=max_results,
                type='channel'
            ).execute()
            
            channels = []
            
            for item in search_response.get('items', []):
                channel_id = item['snippet']['channelId']
                
                # Get channel statistics
                channel_response = youtube.channels().list(
                    part='statistics',
                    id=channel_id
                ).execute()
                
                stats = channel_response['items'][0]['statistics'] if channel_response.get('items') else {}
                
                channel_info = {
                    "id": channel_id,
                    "title": item['snippet']['title'],
                    "description": item['snippet']['description'][:100] + "..." if len(item['snippet']['description']) > 100 else item['snippet']['description'],
                    "thumbnail": item['snippet']['thumbnails']['high']['url'],
                    "published_at": item['snippet']['publishedAt'],
                    "statistics": {
                        "subscribers": int(stats.get('subscriberCount', 0)),
                        "videos": int(stats.get('videoCount', 0)),
                        "views": int(stats.get('viewCount', 0))
                    }
                }
                channels.append(channel_info)
            
            return Response({
                "query": query,
                "channels": channels,
                "total_results": len(channels)
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VideoSearchView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Search for YouTube videos"""
        
        try:
            query = request.GET.get('q', '')
            max_results = int(request.GET.get('max_results', 10))
            
            if not query:
                return Response({"error": "Search query required"}, status=status.HTTP_400_BAD_REQUEST)
            
            youtube = get_youtube_service()
            
            # Search for videos
            search_response = youtube.search().list(
                part='snippet',
                q=query,
                maxResults=max_results,
                type='video',
                order='viewCount'  # Most viewed first
            ).execute()
            
            video_ids = [item['id']['videoId'] for item in search_response.get('items', [])]
            
            videos = []
            
            if video_ids:
                # Get video statistics
                videos_response = youtube.videos().list(
                    part='statistics,contentDetails',
                    id=','.join(video_ids)
                ).execute()
                
                # Map statistics to videos
                stats_map = {item['id']: item for item in videos_response.get('items', [])}
                
                for item in search_response.get('items', []):
                    video_id = item['id']['videoId']
                    stats = stats_map.get(video_id, {})
                    
                    video_info = {
                        "id": video_id,
                        "title": item['snippet']['title'],
                        "description": item['snippet']['description'][:150] + "..." if len(item['snippet']['description']) > 150 else item['snippet']['description'],
                        "channel_title": item['snippet']['channelTitle'],
                        "channel_id": item['snippet']['channelId'],
                        "published_at": item['snippet']['publishedAt'],
                        "thumbnail": item['snippet']['thumbnails']['high']['url'],
                        "statistics": {
                            "views": int(stats.get('statistics', {}).get('viewCount', 0)),
                            "likes": int(stats.get('statistics', {}).get('likeCount', 0)),
                            "comments": int(stats.get('statistics', {}).get('commentCount', 0))
                        } if stats else {},
                        "duration": stats.get('contentDetails', {}).get('duration', '') if stats else ''
                    }
                    videos.append(video_info)
            
            return Response({
                "query": query,
                "videos": videos,
                "total_results": len(videos)
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChannelDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, channel_id):
        """Get detailed information about a specific channel"""
        
        try:
            youtube = get_youtube_service()
            
            # Get channel details
            channel_response = youtube.channels().list(
                part='statistics,snippet,brandingSettings,contentDetails',
                id=channel_id
            ).execute()
            
            if not channel_response.get('items'):
                return Response({"error": "Channel not found"}, status=status.HTTP_404_NOT_FOUND)
            
            channel_data = channel_response['items'][0]
            
            # Get uploads playlist
            uploads_playlist_id = channel_data['contentDetails']['relatedPlaylists']['uploads']
            
            # Get recent uploads
            playlist_response = youtube.playlistItems().list(
                part='snippet',
                playlistId=uploads_playlist_id,
                maxResults=5
            ).execute()
            
            recent_videos = []
            for item in playlist_response.get('items', []):
                recent_videos.append({
                    "id": item['snippet']['resourceId']['videoId'],
                    "title": item['snippet']['title'],
                    "published_at": item['snippet']['publishedAt'],
                    "thumbnail": item['snippet']['thumbnails']['high']['url']
                })
            
            channel_info = {
                "id": channel_data['id'],
                "title": channel_data['snippet']['title'],
                "description": channel_data['snippet']['description'],
                "custom_url": channel_data['snippet'].get('customUrl', ''),
                "published_at": channel_data['snippet']['publishedAt'],
                "country": channel_data['snippet'].get('country', ''),
                "thumbnails": channel_data['snippet']['thumbnails'],
                "statistics": {
                    "view_count": int(channel_data['statistics'].get('viewCount', 0)),
                    "subscriber_count": int(channel_data['statistics'].get('subscriberCount', 0)),
                    "video_count": int(channel_data['statistics'].get('videoCount', 0)),
                    "hidden_subscriber_count": channel_data['statistics'].get('hiddenSubscriberCount', False)
                },
                "branding": {
                    "image": channel_data['brandingSettings'].get('image', {}),
                    "channel": channel_data['brandingSettings'].get('channel', {})
                },
                "recent_videos": recent_videos
            }
            
            return Response(channel_info)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==============================================
# KEEP EXISTING VIEWS (with minimal changes)
# ==============================================
class AudienceDemographicsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get audience demographics data (Mock - YouTube API doesn't provide this without OAuth)"""
        
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
            },
            "note": "This is mock data. Real demographics require YouTube Analytics API with OAuth."
        }
        
        return Response(demographics)


class RevenueAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get revenue analytics data (Mock - Requires YouTube Analytics API)"""
        
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
            "rpm": 12.35,
            "note": "This is mock data. Real revenue data requires YouTube Analytics API with OAuth."
        }
        
        return Response(revenue_data)


class RealTimeAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get real-time analytics (last 60 minutes) - Mock"""
        
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
            },
            "note": "This is mock data. Real-time data requires YouTube Live Streaming API."
        }
        
        return Response(realtime_data)


class ExportAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Export analytics data"""
        
        format_type = request.GET.get('format', 'json')
        channel_id = request.GET.get('channel_id', '')
        
        try:
            if channel_id:
                # Fetch real data
                youtube = get_youtube_service()
                channel_response = youtube.channels().list(
                    part='statistics,snippet',
                    id=channel_id
                ).execute()
                
                if channel_response.get('items'):
                    channel = channel_response['items'][0]
                    data = {
                        "channel_title": channel['snippet']['title'],
                        "total_views": int(channel['statistics'].get('viewCount', 0)),
                        "subscribers": int(channel['statistics'].get('subscriberCount', 0)),
                        "total_videos": int(channel['statistics'].get('videoCount', 0)),
                        "exported_at": str(timezone.now()),
                        "channel_id": channel_id
                    }
                else:
                    data = {"error": "Channel not found", "exported_at": str(timezone.now())}
            else:
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
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get dashboard summary data with optional real data"""
        
        try:
            channel_id = request.GET.get('channel_id', '')
            summary = {}
            
            if channel_id:
                # Try to get real data
                youtube = get_youtube_service()
                channel_response = youtube.channels().list(
                    part='statistics,snippet',
                    id=channel_id
                ).execute()
                
                if channel_response.get('items'):
                    channel = channel_response['items'][0]
                    stats = channel['statistics']
                    
                    summary = {
                        "quick_stats": {
                            "total_views": f"{int(stats.get('viewCount', 0)):,}",
                            "subscribers": f"{int(stats.get('subscriberCount', 0)):,}",
                            "videos": int(stats.get('videoCount', 0)),
                            "channel_title": channel['snippet']['title']
                        },
                        "api_status": "real_data",
                        "channel_id": channel_id
                    }
                else:
                    summary = {"error": "Channel not found", "api_status": "error"}
            else:
                # Mock data
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
                    ],
                    "api_status": "mock_data"
                }
            
            return Response(summary)
            
        except Exception as e:
            return Response({"error": str(e), "api_status": "error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class YouTubeDashboardView(APIView):
    """Dashboard view that returns data in the exact format frontend expects"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get complete dashboard data"""
        
        try:
            channel_id = request.GET.get('channel_id', 'UC-2Mn1v6KM5OCdr0mauE0Jg')
            period = request.GET.get('period', 'last30days')
            
            # Initialize YouTube API
            youtube = get_youtube_service()
            
            # Get channel statistics
            channel_response = youtube.channels().list(
                part='statistics,snippet',
                id=channel_id
            ).execute()
            
            if not channel_response.get('items'):
                return Response({
                    "error": "Channel not found"
                }, status=status.HTTP_404_NOT_FOUND)
            
            channel_data = channel_response['items'][0]
            stats = channel_data['statistics']
            snippet = channel_data['snippet']
            
            # Calculate date range
            end_date = datetime.now()
            if period == 'last7days':
                start_date = end_date - timedelta(days=7)
            elif period == 'last90days':
                start_date = end_date - timedelta(days=90)
            else:  # last30days default
                start_date = end_date - timedelta(days=30)
            
            # Get videos for this channel
            videos_response = youtube.search().list(
                part='id',
                channelId=channel_id,
                maxResults=10,
                order='date',
                type='video'
            ).execute()
            
            video_ids = [item['id']['videoId'] for item in videos_response.get('items', [])]
            
            # Get video statistics if we have videos
            sample_views = 0
            top_videos = []
            
            if video_ids:
                videos_stats = youtube.videos().list(
                    part='statistics,contentDetails,snippet',
                    id=','.join(video_ids)
                ).execute()
                
                for video in videos_stats.get('items', []):
                    views = int(video['statistics'].get('viewCount', 0))
                    sample_views += views
                    
                    top_videos.append({
                        "id": video['id'],
                        "title": video['snippet']['title'],
                        "description": video['snippet']['description'][:150] + "..." if len(video['snippet']['description']) > 150 else video['snippet']['description'],
                        "views": views,
                        "likes": int(video['statistics'].get('likeCount', 0)),
                        "comments": int(video['statistics'].get('commentCount', 0)),
                        "duration": video['contentDetails']['duration'],
                        "published_at": video['snippet']['publishedAt'],
                        "thumbnail": video['snippet']['thumbnails']['high']['url'],
                        "tags": video['snippet'].get('tags', [])[:5]
                    })
            
            # Sort videos by views
            top_videos.sort(key=lambda x: x['views'], reverse=True)
            
            # Calculate estimated metrics
            total_views = int(stats.get('viewCount', 0))
            total_videos = int(stats.get('videoCount', 0))
            
            # Estimated watch time (assuming 5 minutes per view)
            estimated_watch_time_hours = (total_views * 5) / 60 if total_views > 0 else 0
            
            # Calculate engagement rate from sample videos
            engagement_rate = 0
            if top_videos and total_views > 0:
                total_likes = sum(video['likes'] for video in top_videos)
                engagement_rate = (total_likes / total_views) * 100
            
            # Estimated revenue (rough estimate: $2 per 1000 views)
            estimated_revenue = (total_views / 1000) * 2 if total_views > 0 else 0
            
            # Prepare response in the EXACT format frontend expects
            response_data = {
                # Channel info
                "channel_info": {
                    "title": snippet.get('title', 'Unknown Channel'),
                    "description": snippet.get('description', '')[:100] + "...",
                    "custom_url": snippet.get('customUrl', ''),
                    "published_at": snippet.get('publishedAt', ''),
                    "thumbnail": snippet.get('thumbnails', {}).get('high', {}).get('url', '')
                },
                
                # Statistics (frontend expects this exact structure)
                "statistics": {
                    "total_views": total_views,
                    "subscribers": int(stats.get('subscriberCount', 0)),
                    "total_videos": total_videos,
                    "sample_views": sample_views,
                },
                
                # Period info
                "period": period,
                "date_range": {
                    "start": start_date.strftime('%Y-%m-%d'),
                    "end": end_date.strftime('%Y-%m-%d')
                },
                
                # Additional metrics for dashboard
                "quick_metrics": {
                    "estimated_watch_time": round(estimated_watch_time_hours, 1),
                    "engagement_rate": round(engagement_rate, 2),
                    "estimated_revenue": round(estimated_revenue, 2),
                    "avg_video_views": round(total_views / total_videos) if total_videos > 0 else 0,
                },
                
                # Top videos
                "top_videos": top_videos[:5],  # Only top 5
                
                # Status
                "api_status": "success",
                "channel_id": channel_id
            }
            
            return Response(response_data)
            
        except HttpError as e:
            return Response({
                "error": f"YouTube API Error: {str(e)}",
                "api_status": "error"
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "error": str(e),
                "api_status": "error"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



            
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint with API test"""
    
    # Test YouTube API if key is available
    api_status = "unknown"
    try:
        youtube = get_youtube_service()
        # Simple test request
        test_response = youtube.videos().list(
            part='snippet',
            id='dQw4w9WgXcQ'
        ).execute()
        api_status = "working" if test_response.get('items') else "no_data"
    except Exception as e:
        api_status = f"error: {str(e)[:50]}"
    
    return Response({
        "status": "healthy",
        "timestamp": str(timezone.now()),
        "service": "YouTube Analytics API",
        "version": "1.0.0",
        "youtube_api_status": api_status
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
        "last_login": str(user.last_login) if user.last_login else "Never",
        "youtube_api_available": bool(getattr(settings, 'YOUTUBE_API_KEY', None))
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_test(request):
    """Test YouTube API connectivity"""
    
    try:
        youtube = get_youtube_service()
        
        # Test with a known video
        test_response = youtube.videos().list(
            part='snippet,statistics',
            id='dQw4w9WgXcQ'  # Rick Astley - Never Gonna Give You Up
        ).execute()
        
        if test_response.get('items'):
            video = test_response['items'][0]
            return Response({
                "status": "success",
                "message": "YouTube API is working correctly",
                "test_video": {
                    "title": video['snippet']['title'],
                    "channel": video['snippet']['channelTitle'],
                    "views": video['statistics']['viewCount'],
                    "likes": video['statistics'].get('likeCount', 'N/A')
                }
            })
        else:
            return Response({
                "status": "success",
                "message": "YouTube API is working but no video found",
                "response": test_response
            })
            
    except HttpError as e:
        return Response({
            "status": "error",
            "message": "YouTube API Error",
            "details": str(e),
            "error_code": e.resp.status if hasattr(e, 'resp') else 'Unknown'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            "status": "error",
            "message": "Internal Server Error",
            "details": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



        

# from rest_framework import viewsets, status, generics
# from rest_framework.decorators import action, api_view, permission_classes
# from rest_framework.response import Response
# from datetime import datetime, timedelta 
# from rest_framework.generics import DestroyAPIView
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework.authtoken.models import Token
# from django.contrib.auth.models import User
# from django.utils import timezone
# from django.db.models import Sum, Avg, Count, F
# from datetime import timedelta
# import logging

# from .models import (
#     UserProfile, Channel, SyncJob, Video, VideoStatistics, Comment,
#     AnalyticsMetric, PerformancePrediction, ContentRecommendation,
#     Dashboard, Report, Alert, Notification, SystemLog, APIUsage,
#     SystemConfiguration, Note
# )
# from .serializers import (
#     UserSerializer, UserProfileSerializer, UserRegistrationSerializer,
#     ChannelSerializer, SyncJobSerializer, VideoSerializer, VideoStatisticsSerializer,
#     CommentSerializer, AnalyticsMetricSerializer, PerformancePredictionSerializer,
#     ContentRecommendationSerializer, DashboardSerializer, ReportSerializer,
#     AlertSerializer, NotificationSerializer, SystemLogSerializer,
#     APIUsageSerializer, SystemConfigurationSerializer, NoteSerializer
# )

# logger = logging.getLogger(__name__)


# # ============================================
# # MODULE 1: USER AUTHENTICATION & MANAGEMENT
# # ============================================


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def youtube_dashboard(request):
#     """
#     Dashboard endpoint for a specific YouTube channel.
#     Expects query params:
#     - channel_id: YouTube channel ID string
#     - period: last7days | last30days | last90days
#     """
#     channel_id = request.query_params.get('channel_id')
#     period = request.query_params.get('period', 'last30days')

#     if not channel_id:
#         return Response({"error": "channel_id is required"}, status=400)

#     # Lookup channel by youtube_channel_id
#     try:
#         channel = Channel.objects.get(youtube_channel_id=channel_id, user=request.user)
#     except Channel.DoesNotExist:
#         return Response({"error": "Channel not found"}, status=404)

#     # Determine date range based on period
#     end_date = timezone.now().date()
#     if period == "last7days":
#         start_date = end_date - timedelta(days=7)
#     elif period == "last30days":
#         start_date = end_date - timedelta(days=30)
#     elif period == "last90days":
#         start_date = end_date - timedelta(days=90)
#     else:
#         start_date = end_date - timedelta(days=30)

#     # Get video stats for this channel
#     videos = Video.objects.filter(channel=channel, published_at__date__gte=start_date, published_at__date__lte=end_date)

#     total_views = videos.aggregate(total_views_sum=Sum('view_count'))['total_views_sum'] or 0
#     total_likes = videos.aggregate(total_likes_sum=Sum('like_count'))['total_likes_sum'] or 0
#     total_comments = videos.aggregate(total_comments_sum=Sum('comment_count'))['total_comments_sum'] or 0
#     total_videos = videos.count()
    
#     # Quick metrics (example calculations)
#     engagement_rate = (total_likes / total_views * 100) if total_views > 0 else 0
#     estimated_watch_time = total_views * 0.5 / 60  # Example: 0.5 minutes per view
#     estimated_revenue = total_views * 0.001  # Example CPM calculation

#     response_data = {
#         "channel_id": channel.youtube_channel_id,
#         "channel_info": {
#             "title": channel.channel_name,
#             "description": channel.description,
#             "thumbnail": channel.thumbnail_url,
#             "custom_url": channel.channel_url,
#             "published_at": channel.videos.first().published_at if channel.videos.exists() else None
#         },
#         "statistics": {
#             "total_views": total_views,
#             "total_likes": total_likes,
#             "total_comments": total_comments,
#             "total_videos": total_videos
#         },
#         "quick_metrics": {
#             "engagement_rate": engagement_rate,
#             "estimated_watch_time": estimated_watch_time,
#             "estimated_revenue": estimated_revenue,
#             "avg_video_views": total_views // total_videos if total_videos > 0 else 0
#         },
#         "period": period,
#         "date_range": {"start": start_date, "end": end_date},
#         "api_status": "success"
#     }

#     return Response(response_data)



# class NoteDelete(DestroyAPIView):
#     queryset = Note.objects.all()
#     serializer_class = NoteSerializer
#     permission_classes = [IsAuthenticated]

# class NoteViewSet(viewsets.ModelViewSet):
#     """
#     Full CRUD for Notes
#     """
#     queryset = Note.objects.all()
#     serializer_class = NoteSerializer
#     permission_classes = [IsAuthenticated]

# class NoteListCreate(generics.ListCreateAPIView):
#     serializer_class = NoteSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Note.objects.all()  # or filter by user if you add user field

#     def perform_create(self, serializer):
#         serializer.save()


# class UserRegistrationView(generics.CreateAPIView):
#     """User registration endpoint"""
#     queryset = User.objects.all()
#     serializer_class = UserRegistrationSerializer
#     permission_classes = [AllowAny]

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()
#         token, created = Token.objects.get_or_create(user=user)
        
#         return Response({
#             'user': UserSerializer(user).data,
#             'token': token.key,
#             'message': 'User registered successfully'
#         }, status=status.HTTP_201_CREATED)


# class UserProfileViewSet(viewsets.ModelViewSet):
#     """User profile management"""
#     serializer_class = UserProfileSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return UserProfile.objects.filter(user=self.request.user)

#     def get_object(self):
#         return self.request.user.profile

#     @action(detail=False, methods=['get'])
#     def me(self, request):
#         """Get current user profile"""
#         profile = request.user.profile
#         serializer = self.get_serializer(profile)
#         return Response(serializer.data)

#     @action(detail=False, methods=['put'])
#     def update_profile(self, request):
#         """Update user profile"""
#         profile = request.user.profile
#         serializer = self.get_serializer(profile, data=request.data, partial=True)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data)


# @api_view(['POST'])
# @permission_classes([AllowAny])
# def login_view(request):
#     """User login endpoint"""
#     username = request.data.get('username')
#     password = request.data.get('password')

#     try:
#         user = User.objects.get(username=username)
#         if user.check_password(password):
#             token, created = Token.objects.get_or_create(user=user)
#             SystemLog.objects.create(
#                 user=user,
#                 action='User Login',
#                 log_level='info',
#                 ip_address=get_client_ip(request)
#             )
#             return Response({
#                 'token': token.key,
#                 'user': UserSerializer(user).data
#             })
#         else:
#             return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
#     except User.DoesNotExist:
#         return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def logout_view(request):
#     """User logout endpoint"""
#     request.user.auth_token.delete()
#     SystemLog.objects.create(
#         user=request.user,
#         action='User Logout',
#         log_level='info',
#         ip_address=get_client_ip(request)
#     )
#     return Response({'message': 'Logged out successfully'})


# # ============================================
# # MODULE 2: YOUTUBE INTEGRATION
# # ============================================

# class ChannelViewSet(viewsets.ModelViewSet):
#     """YouTube Channel management"""
#     serializer_class = ChannelSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Channel.objects.filter(user=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)

#     @action(detail=True, methods=['post'])
#     def sync_now(self, request, pk=None):
#         """Trigger immediate sync for a channel"""
#         channel = self.get_object()
#         sync_job = SyncJob.objects.create(
#             channel=channel,
#             job_type='full_sync',
#             priority='high'
#         )
#         return Response({
#             'message': 'Sync job created',
#             'job_id': sync_job.id
#         })

#     @action(detail=False, methods=['get'])
#     def my_channels(self, request):
#         """Get all channels for current user"""
#         channels = self.get_queryset()
#         serializer = self.get_serializer(channels, many=True)
#         return Response(serializer.data)


# # ============================================
# # MODULE 3: DATA COLLECTION & SYNCHRONIZATION
# # ============================================

# class SyncJobViewSet(viewsets.ReadOnlyModelViewSet):
#     """Sync job monitoring"""
#     serializer_class = SyncJobSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return SyncJob.objects.filter(channel__user=self.request.user)

#     @action(detail=False, methods=['get'])
#     def recent_jobs(self, request):
#         """Get recent sync jobs"""
#         jobs = self.get_queryset().order_by('-created_at')[:10]
#         serializer = self.get_serializer(jobs, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['get'])
#     def job_status(self, request):
#         """Get overall sync job status"""
#         jobs = self.get_queryset()
#         status_summary = {
#             'pending': jobs.filter(status='pending').count(),
#             'processing': jobs.filter(status='processing').count(),
#             'completed': jobs.filter(status='completed').count(),
#             'failed': jobs.filter(status='failed').count(),
#         }
#         return Response(status_summary)


# # ============================================
# # MODULE 4: DATA PROCESSING & ETL
# # ============================================

# class VideoViewSet(viewsets.ModelViewSet):
#     """Video management and analytics"""
#     serializer_class = VideoSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Video.objects.filter(channel__user=self.request.user)

#     @action(detail=False, methods=['get'])
#     def top_videos(self, request):
#         """Get top performing videos"""
#         limit = request.query_params.get('limit', 10)
#         videos = self.get_queryset().order_by('-view_count')[:int(limit)]
#         serializer = self.get_serializer(videos, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['get'])
#     def recent_videos(self, request):
#         """Get recently published videos"""
#         limit = request.query_params.get('limit', 10)
#         videos = self.get_queryset().order_by('-published_at')[:int(limit)]
#         serializer = self.get_serializer(videos, many=True)
#         return Response(serializer.data)

#     @action(detail=True, methods=['get'])
#     def video_analytics(self, request, pk=None):
#         """Get detailed analytics for a video"""
#         video = self.get_object()
#         stats = video.statistics.all().order_by('-date')
        
#         analytics = {
#             'video': VideoSerializer(video).data,
#             'statistics': VideoStatisticsSerializer(stats, many=True).data,
#             'total_views': video.view_count,
#             'total_likes': video.like_count,
#             'total_comments': video.comment_count,
#             'engagement_rate': video.engagement_rate,
#             'like_ratio': video.like_ratio,
#         }
#         return Response(analytics)


# class CommentViewSet(viewsets.ReadOnlyModelViewSet):
#     """Comment management with sentiment analysis"""
#     serializer_class = CommentSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Comment.objects.filter(video__channel__user=self.request.user)

#     @action(detail=False, methods=['get'])
#     def sentiment_summary(self, request):
#         """Get sentiment analysis summary"""
#         comments = self.get_queryset()
#         summary = {
#             'total_comments': comments.count(),
#             'positive': comments.filter(sentiment_label='positive').count(),
#             'negative': comments.filter(sentiment_label='negative').count(),
#             'neutral': comments.filter(sentiment_label='neutral').count(),
#             'average_sentiment_score': comments.aggregate(Avg('sentiment_score'))['sentiment_score__avg'] or 0,
#         }
#         return Response(summary)

#     @action(detail=False, methods=['get'])
#     def top_comments(self, request):
#         """Get top liked comments"""
#         limit = request.query_params.get('limit', 10)
#         comments = self.get_queryset().order_by('-like_count')[:int(limit)]
#         serializer = self.get_serializer(comments, many=True)
#         return Response(serializer.data)


# # ============================================
# # MODULE 5: ANALYTICS ENGINE
# # ============================================

# class AnalyticsMetricViewSet(viewsets.ReadOnlyModelViewSet):
#     """Analytics metrics and KPIs"""
#     serializer_class = AnalyticsMetricSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return AnalyticsMetric.objects.filter(channel__user=self.request.user)

#     @action(detail=False, methods=['get'])
#     def channel_analytics(self, request):
#         """Get analytics for a specific channel"""
#         channel_id = request.query_params.get('channel_id')
#         days = int(request.query_params.get('days', 30))

#         if not channel_id:
#             return Response({'error': 'channel_id is required'}, status=status.HTTP_400_BAD_REQUEST)

#         metrics = self.get_queryset().filter(
#             channel_id=channel_id,
#             date__gte=timezone.now().date() - timedelta(days=days)
#         ).order_by('-date')

#         serializer = self.get_serializer(metrics, many=True)
        
#         # Calculate summary statistics
#         summary = {
#             'total_views': metrics.aggregate(Sum('total_views'))['total_views__sum'] or 0,
#             'total_engagement': metrics.aggregate(Sum('total_likes'))['total_likes__sum'] or 0,
#             'avg_engagement_rate': metrics.aggregate(Avg('engagement_rate'))['engagement_rate__avg'] or 0,
#             'subscriber_growth': metrics.aggregate(Sum('new_subscribers'))['new_subscribers__sum'] or 0,
#         }

#         return Response({
#             'metrics': serializer.data,
#             'summary': summary
#         })

#     @action(detail=False, methods=['get'])
#     def growth_trends(self, request):
#         """Get growth trends"""
#         channel_id = request.query_params.get('channel_id')
#         days = int(request.query_params.get('days', 90))

#         if not channel_id:
#             return Response({'error': 'channel_id is required'}, status=status.HTTP_400_BAD_REQUEST)

#         metrics = self.get_queryset().filter(
#             channel_id=channel_id,
#             date__gte=timezone.now().date() - timedelta(days=days)
#         ).order_by('date')

#         serializer = self.get_serializer(metrics, many=True)
#         return Response(serializer.data)


# # ============================================
# # MODULE 6: MACHINE LEARNING
# # ============================================

# class PerformancePredictionViewSet(viewsets.ReadOnlyModelViewSet):
#     """ML-based performance predictions"""
#     serializer_class = PerformancePredictionSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return PerformancePrediction.objects.filter(video__channel__user=self.request.user)

#     @action(detail=False, methods=['get'])
#     def predictions_summary(self, request):
#         """Get predictions summary"""
#         predictions = self.get_queryset()
#         summary = {
#             'total_predictions': predictions.count(),
#             'avg_confidence': predictions.aggregate(Avg('confidence_score'))['confidence_score__avg'] or 0,
#             'avg_accuracy': predictions.filter(accuracy__isnull=False).aggregate(Avg('accuracy'))['accuracy__avg'] or 0,
#         }
#         return Response(summary)


# class ContentRecommendationViewSet(viewsets.ReadOnlyModelViewSet):
#     """AI-generated content recommendations"""
#     serializer_class = ContentRecommendationSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return ContentRecommendation.objects.filter(channel__user=self.request.user)

#     @action(detail=False, methods=['get'])
#     def channel_recommendations(self, request):
#         """Get recommendations for a channel"""
#         channel_id = request.query_params.get('channel_id')

#         if not channel_id:
#             return Response({'error': 'channel_id is required'}, status=status.HTTP_400_BAD_REQUEST)

#         recommendations = self.get_queryset().filter(channel_id=channel_id).order_by('-confidence_score')
#         serializer = self.get_serializer(recommendations, many=True)
#         return Response(serializer.data)


# # ============================================
# # MODULE 7: VISUALIZATION & DASHBOARD
# # ============================================

# class DashboardViewSet(viewsets.ModelViewSet):
#     """Custom dashboard management"""
#     serializer_class = DashboardSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Dashboard.objects.filter(user=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)

#     @action(detail=False, methods=['get'])
#     def default_dashboard(self, request):
#         """Get default dashboard"""
#         dashboard = self.get_queryset().filter(is_default=True).first()
#         if dashboard:
#             serializer = self.get_serializer(dashboard)
#             return Response(serializer.data)
#         return Response({'error': 'No default dashboard found'}, status=status.HTTP_404_NOT_FOUND)


# # ============================================
# # MODULE 8: REPORTING MODULE
# # ============================================

# class ReportViewSet(viewsets.ModelViewSet):
#     """Report generation and management"""
#     serializer_class = ReportSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Report.objects.filter(user=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)

#     @action(detail=False, methods=['post'])
#     def generate_report(self, request):
#         """Generate a new report"""
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         report = serializer.save(user=request.user)
        
#         # Trigger report generation task
#         # In production, this would be a Celery task
        
#         return Response({
#             'message': 'Report generation started',
#             'report_id': report.id
#         }, status=status.HTTP_201_CREATED)

#     @action(detail=True, methods=['get'])
#     def download_report(self, request, pk=None):
#         """Download generated report"""
#         report = self.get_object()
#         if report.file_path:
#             return Response({
#                 'download_url': report.file_path,
#                 'format': report.format
#             })
#         return Response({'error': 'Report not yet generated'}, status=status.HTTP_400_BAD_REQUEST)


# # ============================================
# # MODULE 9: ALERT & NOTIFICATION
# # ============================================

# class AlertViewSet(viewsets.ModelViewSet):
#     """Alert configuration and management"""
#     serializer_class = AlertSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Alert.objects.filter(user=self.request.user)

#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)

#     @action(detail=False, methods=['get'])
#     def active_alerts(self, request):
#         """Get active alerts"""
#         alerts = self.get_queryset().filter(is_active=True)
#         serializer = self.get_serializer(alerts, many=True)
#         return Response(serializer.data)


# class NotificationViewSet(viewsets.ModelViewSet):
#     """User notifications"""
#     serializer_class = NotificationSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return Notification.objects.filter(user=self.request.user)

#     @action(detail=False, methods=['get'])
#     def unread_notifications(self, request):
#         """Get unread notifications"""
#         notifications = self.get_queryset().filter(is_read=False)
#         serializer = self.get_serializer(notifications, many=True)
#         return Response(serializer.data)

#     @action(detail=False, methods=['post'])
#     def mark_all_as_read(self, request):
#         """Mark all notifications as read"""
#         self.get_queryset().update(is_read=True)
#         return Response({'message': 'All notifications marked as read'})

#     @action(detail=True, methods=['post'])
#     def mark_as_read(self, request, pk=None):
#         """Mark notification as read"""
#         notification = self.get_object()
#         notification.is_read = True
#         notification.save()
#         return Response({'message': 'Notification marked as read'})


# # ============================================
# # MODULE 10: ADMINISTRATION
# # ============================================

# class SystemLogViewSet(viewsets.ReadOnlyModelViewSet):
#     """System activity logs"""
#     serializer_class = SystemLogSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         if self.request.user.is_staff:
#             return SystemLog.objects.all()
#         return SystemLog.objects.filter(user=self.request.user)

#     @action(detail=False, methods=['get'])
#     def recent_logs(self, request):
#         """Get recent system logs"""
#         limit = request.query_params.get('limit', 50)
#         logs = self.get_queryset().order_by('-created_at')[:int(limit)]
#         serializer = self.get_serializer(logs, many=True)
#         return Response(serializer.data)


# class APIUsageViewSet(viewsets.ReadOnlyModelViewSet):
#     """API usage tracking"""
#     serializer_class = APIUsageSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         if self.request.user.is_staff:
#             return APIUsage.objects.all()
#         return APIUsage.objects.filter(user=self.request.user)

#     @action(detail=False, methods=['get'])
#     def usage_summary(self, request):
#         """Get API usage summary"""
#         usage = self.get_queryset()
#         summary = {
#             'total_requests': usage.aggregate(Sum('request_count'))['request_count__sum'] or 0,
#             'avg_response_time': usage.aggregate(Avg('response_time_ms'))['response_time_ms__avg'] or 0,
#             'endpoints': usage.values('endpoint').annotate(count=Count('id')),
#         }
#         return Response(summary)


# class SystemConfigurationViewSet(viewsets.ModelViewSet):
#     """System configuration management"""
#     serializer_class = SystemConfigurationSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return SystemConfiguration.objects.all()

#     def check_permissions(self, request):
#         if not request.user.is_staff:
#             self.permission_denied(request)


# # ============================================
# # UTILITY FUNCTIONS
# # ============================================

# def get_client_ip(request):
#     """Get client IP address"""
#     x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
#     if x_forwarded_for:
#         ip = x_forwarded_for.split(',')[0]
#     else:
#         ip = request.META.get('REMOTE_ADDR')
#     return ip


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def dashboard_summary(request):
#     """Get dashboard summary for current user"""
#     try:
#         user = request.user
        
#         channels = Channel.objects.filter(user=user)
#         videos = Video.objects.filter(channel__user=user)
        
#         summary = {
#             'total_channels': channels.count(),
#             'total_videos': videos.count(),
#             'total_views': videos.aggregate(Sum('view_count'))['view_count__sum'] or 0,
#             'total_subscribers': channels.aggregate(Sum('subscriber_count'))['subscriber_count__sum'] or 0,
#             'total_engagement': videos.aggregate(Sum('like_count'))['like_count__sum'] or 0,
#             'unread_notifications': Notification.objects.filter(user=user, is_read=False).count(),
#         }
        
#         return Response(summary)
#     except Exception as e:
#         logger.error(f"Error in dashboard_summary: {str(e)}")
#         # Return default summary if tables don't exist yet
#         return Response({
#             'total_channels': 0,
#             'total_videos': 0,
#             'total_views': 0,
#             'total_subscribers': 0,
#             'total_engagement': 0,
#             'unread_notifications': 0,
#             'message': 'Database tables not yet created. Run migrations first.'
#         })


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])  
# def health_check(request):
#     """Health check endpoint"""
#     return Response({
#         'status': 'healthy',
#         'timestamp': timezone.now(),
#         'user': request.user.username
#     })


# #
