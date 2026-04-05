from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from datetime import datetime, timedelta 
from rest_framework.generics import DestroyAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models import Sum, Avg, Count, F
from datetime import timedelta
import logging

from .models import (
    UserProfile, Channel, SyncJob, Video, VideoStatistics, Comment,
    AnalyticsMetric, PerformancePrediction, ContentRecommendation,
    Dashboard, Report, Alert, Notification, SystemLog, APIUsage,
    SystemConfiguration, Note
)
from .serializers import (
    UserSerializer, UserProfileSerializer, UserRegistrationSerializer,
    ChannelSerializer, SyncJobSerializer, VideoSerializer, VideoStatisticsSerializer,
    CommentSerializer, AnalyticsMetricSerializer, PerformancePredictionSerializer,
    ContentRecommendationSerializer, DashboardSerializer, ReportSerializer,
    AlertSerializer, NotificationSerializer, SystemLogSerializer,
    APIUsageSerializer, SystemConfigurationSerializer, NoteSerializer
)

logger = logging.getLogger(__name__)


# ============================================
# MODULE 1: USER AUTHENTICATION & MANAGEMENT
# ============================================


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def youtube_dashboard(request):
    """
    Dashboard endpoint for a specific YouTube channel.
    Expects query params:
    - channel_id: YouTube channel ID string
    - period: last7days | last30days | last90days
    """
    channel_id = request.query_params.get('channel_id')
    period = request.query_params.get('period', 'last30days')

    if not channel_id:
        return Response({"error": "channel_id is required"}, status=400)

    # Lookup channel by youtube_channel_id
    try:
        channel = Channel.objects.get(youtube_channel_id=channel_id, user=request.user)
    except Channel.DoesNotExist:
        return Response({"error": "Channel not found"}, status=404)

    # Determine date range based on period
    end_date = timezone.now().date()
    if period == "last7days":
        start_date = end_date - timedelta(days=7)
    elif period == "last30days":
        start_date = end_date - timedelta(days=30)
    elif period == "last90days":
        start_date = end_date - timedelta(days=90)
    else:
        start_date = end_date - timedelta(days=30)

    # Get video stats for this channel
    videos = Video.objects.filter(channel=channel, published_at__date__gte=start_date, published_at__date__lte=end_date)

    total_views = videos.aggregate(total_views_sum=Sum('view_count'))['total_views_sum'] or 0
    total_likes = videos.aggregate(total_likes_sum=Sum('like_count'))['total_likes_sum'] or 0
    total_comments = videos.aggregate(total_comments_sum=Sum('comment_count'))['total_comments_sum'] or 0
    total_videos = videos.count()
    
    # Quick metrics (example calculations)
    engagement_rate = (total_likes / total_views * 100) if total_views > 0 else 0
    estimated_watch_time = total_views * 0.5 / 60  # Example: 0.5 minutes per view
    estimated_revenue = total_views * 0.001  # Example CPM calculation

    response_data = {
        "channel_id": channel.youtube_channel_id,
        "channel_info": {
            "title": channel.channel_name,
            "description": channel.description,
            "thumbnail": channel.thumbnail_url,
            "custom_url": channel.channel_url,
            "published_at": channel.videos.first().published_at if channel.videos.exists() else None
        },
        "statistics": {
            "total_views": total_views,
            "total_likes": total_likes,
            "total_comments": total_comments,
            "total_videos": total_videos
        },
        "quick_metrics": {
            "engagement_rate": engagement_rate,
            "estimated_watch_time": estimated_watch_time,
            "estimated_revenue": estimated_revenue,
            "avg_video_views": total_views // total_videos if total_videos > 0 else 0
        },
        "period": period,
        "date_range": {"start": start_date, "end": end_date},
        "api_status": "success"
    }

    return Response(response_data)



class NoteDelete(DestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

class NoteViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for Notes
    """
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.all()  # or filter by user if you add user field

    def perform_create(self, serializer):
        serializer.save()


class UserRegistrationView(generics.CreateAPIView):
    """User registration endpoint"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class UserProfileViewSet(viewsets.ModelViewSet):
    """User profile management"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)

    def get_object(self):
        return self.request.user.profile

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile"""
        profile = request.user.profile
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    @action(detail=False, methods=['put'])
    def update_profile(self, request):
        """Update user profile"""
        profile = request.user.profile
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """User login endpoint"""
    username = request.data.get('username')
    password = request.data.get('password')

    try:
        user = User.objects.get(username=username)
        if user.check_password(password):
            token, created = Token.objects.get_or_create(user=user)
            SystemLog.objects.create(
                user=user,
                action='User Login',
                log_level='info',
                ip_address=get_client_ip(request)
            )
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """User logout endpoint"""
    request.user.auth_token.delete()
    SystemLog.objects.create(
        user=request.user,
        action='User Logout',
        log_level='info',
        ip_address=get_client_ip(request)
    )
    return Response({'message': 'Logged out successfully'})


# ============================================
# MODULE 2: YOUTUBE INTEGRATION
# ============================================

class ChannelViewSet(viewsets.ModelViewSet):
    """YouTube Channel management"""
    serializer_class = ChannelSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Channel.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def sync_now(self, request, pk=None):
        """Trigger immediate sync for a channel"""
        channel = self.get_object()
        sync_job = SyncJob.objects.create(
            channel=channel,
            job_type='full_sync',
            priority='high'
        )
        return Response({
            'message': 'Sync job created',
            'job_id': sync_job.id
        })

    @action(detail=False, methods=['get'])
    def my_channels(self, request):
        """Get all channels for current user"""
        channels = self.get_queryset()
        serializer = self.get_serializer(channels, many=True)
        return Response(serializer.data)


# ============================================
# MODULE 3: DATA COLLECTION & SYNCHRONIZATION
# ============================================

class SyncJobViewSet(viewsets.ReadOnlyModelViewSet):
    """Sync job monitoring"""
    serializer_class = SyncJobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SyncJob.objects.filter(channel__user=self.request.user)

    @action(detail=False, methods=['get'])
    def recent_jobs(self, request):
        """Get recent sync jobs"""
        jobs = self.get_queryset().order_by('-created_at')[:10]
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def job_status(self, request):
        """Get overall sync job status"""
        jobs = self.get_queryset()
        status_summary = {
            'pending': jobs.filter(status='pending').count(),
            'processing': jobs.filter(status='processing').count(),
            'completed': jobs.filter(status='completed').count(),
            'failed': jobs.filter(status='failed').count(),
        }
        return Response(status_summary)


# ============================================
# MODULE 4: DATA PROCESSING & ETL
# ============================================

class VideoViewSet(viewsets.ModelViewSet):
    """Video management and analytics"""
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Video.objects.filter(channel__user=self.request.user)

    @action(detail=False, methods=['get'])
    def top_videos(self, request):
        """Get top performing videos"""
        limit = request.query_params.get('limit', 10)
        videos = self.get_queryset().order_by('-view_count')[:int(limit)]
        serializer = self.get_serializer(videos, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def recent_videos(self, request):
        """Get recently published videos"""
        limit = request.query_params.get('limit', 10)
        videos = self.get_queryset().order_by('-published_at')[:int(limit)]
        serializer = self.get_serializer(videos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def video_analytics(self, request, pk=None):
        """Get detailed analytics for a video"""
        video = self.get_object()
        stats = video.statistics.all().order_by('-date')
        
        analytics = {
            'video': VideoSerializer(video).data,
            'statistics': VideoStatisticsSerializer(stats, many=True).data,
            'total_views': video.view_count,
            'total_likes': video.like_count,
            'total_comments': video.comment_count,
            'engagement_rate': video.engagement_rate,
            'like_ratio': video.like_ratio,
        }
        return Response(analytics)


class CommentViewSet(viewsets.ReadOnlyModelViewSet):
    """Comment management with sentiment analysis"""
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(video__channel__user=self.request.user)

    @action(detail=False, methods=['get'])
    def sentiment_summary(self, request):
        """Get sentiment analysis summary"""
        comments = self.get_queryset()
        summary = {
            'total_comments': comments.count(),
            'positive': comments.filter(sentiment_label='positive').count(),
            'negative': comments.filter(sentiment_label='negative').count(),
            'neutral': comments.filter(sentiment_label='neutral').count(),
            'average_sentiment_score': comments.aggregate(Avg('sentiment_score'))['sentiment_score__avg'] or 0,
        }
        return Response(summary)

    @action(detail=False, methods=['get'])
    def top_comments(self, request):
        """Get top liked comments"""
        limit = request.query_params.get('limit', 10)
        comments = self.get_queryset().order_by('-like_count')[:int(limit)]
        serializer = self.get_serializer(comments, many=True)
        return Response(serializer.data)


# ============================================
# MODULE 5: ANALYTICS ENGINE
# ============================================

class AnalyticsMetricViewSet(viewsets.ReadOnlyModelViewSet):
    """Analytics metrics and KPIs"""
    serializer_class = AnalyticsMetricSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AnalyticsMetric.objects.filter(channel__user=self.request.user)

    @action(detail=False, methods=['get'])
    def channel_analytics(self, request):
        """Get analytics for a specific channel"""
        channel_id = request.query_params.get('channel_id')
        days = int(request.query_params.get('days', 30))

        if not channel_id:
            return Response({'error': 'channel_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        metrics = self.get_queryset().filter(
            channel_id=channel_id,
            date__gte=timezone.now().date() - timedelta(days=days)
        ).order_by('-date')

        serializer = self.get_serializer(metrics, many=True)
        
        # Calculate summary statistics
        summary = {
            'total_views': metrics.aggregate(Sum('total_views'))['total_views__sum'] or 0,
            'total_engagement': metrics.aggregate(Sum('total_likes'))['total_likes__sum'] or 0,
            'avg_engagement_rate': metrics.aggregate(Avg('engagement_rate'))['engagement_rate__avg'] or 0,
            'subscriber_growth': metrics.aggregate(Sum('new_subscribers'))['new_subscribers__sum'] or 0,
        }

        return Response({
            'metrics': serializer.data,
            'summary': summary
        })

    @action(detail=False, methods=['get'])
    def growth_trends(self, request):
        """Get growth trends"""
        channel_id = request.query_params.get('channel_id')
        days = int(request.query_params.get('days', 90))

        if not channel_id:
            return Response({'error': 'channel_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        metrics = self.get_queryset().filter(
            channel_id=channel_id,
            date__gte=timezone.now().date() - timedelta(days=days)
        ).order_by('date')

        serializer = self.get_serializer(metrics, many=True)
        return Response(serializer.data)


# ============================================
# MODULE 6: MACHINE LEARNING
# ============================================

class PerformancePredictionViewSet(viewsets.ReadOnlyModelViewSet):
    """ML-based performance predictions"""
    serializer_class = PerformancePredictionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PerformancePrediction.objects.filter(video__channel__user=self.request.user)

    @action(detail=False, methods=['get'])
    def predictions_summary(self, request):
        """Get predictions summary"""
        predictions = self.get_queryset()
        summary = {
            'total_predictions': predictions.count(),
            'avg_confidence': predictions.aggregate(Avg('confidence_score'))['confidence_score__avg'] or 0,
            'avg_accuracy': predictions.filter(accuracy__isnull=False).aggregate(Avg('accuracy'))['accuracy__avg'] or 0,
        }
        return Response(summary)


class ContentRecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    """AI-generated content recommendations"""
    serializer_class = ContentRecommendationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ContentRecommendation.objects.filter(channel__user=self.request.user)

    @action(detail=False, methods=['get'])
    def channel_recommendations(self, request):
        """Get recommendations for a channel"""
        channel_id = request.query_params.get('channel_id')

        if not channel_id:
            return Response({'error': 'channel_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        recommendations = self.get_queryset().filter(channel_id=channel_id).order_by('-confidence_score')
        serializer = self.get_serializer(recommendations, many=True)
        return Response(serializer.data)


# ============================================
# MODULE 7: VISUALIZATION & DASHBOARD
# ============================================

class DashboardViewSet(viewsets.ModelViewSet):
    """Custom dashboard management"""
    serializer_class = DashboardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Dashboard.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def default_dashboard(self, request):
        """Get default dashboard"""
        dashboard = self.get_queryset().filter(is_default=True).first()
        if dashboard:
            serializer = self.get_serializer(dashboard)
            return Response(serializer.data)
        return Response({'error': 'No default dashboard found'}, status=status.HTTP_404_NOT_FOUND)


# ============================================
# MODULE 8: REPORTING MODULE
# ============================================

class ReportViewSet(viewsets.ModelViewSet):
    """Report generation and management"""
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Report.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def generate_report(self, request):
        """Generate a new report"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        report = serializer.save(user=request.user)
        
        # Trigger report generation task
        # In production, this would be a Celery task
        
        return Response({
            'message': 'Report generation started',
            'report_id': report.id
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def download_report(self, request, pk=None):
        """Download generated report"""
        report = self.get_object()
        if report.file_path:
            return Response({
                'download_url': report.file_path,
                'format': report.format
            })
        return Response({'error': 'Report not yet generated'}, status=status.HTTP_400_BAD_REQUEST)


# ============================================
# MODULE 9: ALERT & NOTIFICATION
# ============================================

class AlertViewSet(viewsets.ModelViewSet):
    """Alert configuration and management"""
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Alert.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def active_alerts(self, request):
        """Get active alerts"""
        alerts = self.get_queryset().filter(is_active=True)
        serializer = self.get_serializer(alerts, many=True)
        return Response(serializer.data)


class NotificationViewSet(viewsets.ModelViewSet):
    """User notifications"""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def unread_notifications(self, request):
        """Get unread notifications"""
        notifications = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read"""
        self.get_queryset().update(is_read=True)
        return Response({'message': 'All notifications marked as read'})

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'message': 'Notification marked as read'})


# ============================================
# MODULE 10: ADMINISTRATION
# ============================================

class SystemLogViewSet(viewsets.ReadOnlyModelViewSet):
    """System activity logs"""
    serializer_class = SystemLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return SystemLog.objects.all()
        return SystemLog.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def recent_logs(self, request):
        """Get recent system logs"""
        limit = request.query_params.get('limit', 50)
        logs = self.get_queryset().order_by('-created_at')[:int(limit)]
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)


class APIUsageViewSet(viewsets.ReadOnlyModelViewSet):
    """API usage tracking"""
    serializer_class = APIUsageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return APIUsage.objects.all()
        return APIUsage.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def usage_summary(self, request):
        """Get API usage summary"""
        usage = self.get_queryset()
        summary = {
            'total_requests': usage.aggregate(Sum('request_count'))['request_count__sum'] or 0,
            'avg_response_time': usage.aggregate(Avg('response_time_ms'))['response_time_ms__avg'] or 0,
            'endpoints': usage.values('endpoint').annotate(count=Count('id')),
        }
        return Response(summary)


class SystemConfigurationViewSet(viewsets.ModelViewSet):
    """System configuration management"""
    serializer_class = SystemConfigurationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SystemConfiguration.objects.all()

    def check_permissions(self, request):
        if not request.user.is_staff:
            self.permission_denied(request)


# ============================================
# UTILITY FUNCTIONS
# ============================================

def get_client_ip(request):
    """Get client IP address"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_summary(request):
    """Get dashboard summary for current user"""
    try:
        user = request.user
        
        channels = Channel.objects.filter(user=user)
        videos = Video.objects.filter(channel__user=user)
        
        summary = {
            'total_channels': channels.count(),
            'total_videos': videos.count(),
            'total_views': videos.aggregate(Sum('view_count'))['view_count__sum'] or 0,
            'total_subscribers': channels.aggregate(Sum('subscriber_count'))['subscriber_count__sum'] or 0,
            'total_engagement': videos.aggregate(Sum('like_count'))['like_count__sum'] or 0,
            'unread_notifications': Notification.objects.filter(user=user, is_read=False).count(),
        }
        
        return Response(summary)
    except Exception as e:
        logger.error(f"Error in dashboard_summary: {str(e)}")
        # Return default summary if tables don't exist yet
        return Response({
            'total_channels': 0,
            'total_videos': 0,
            'total_views': 0,
            'total_subscribers': 0,
            'total_engagement': 0,
            'unread_notifications': 0,
            'message': 'Database tables not yet created. Run migrations first.'
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def health_check(request):
    """Health check endpoint"""
    return Response({
        'status': 'healthy',
        'timestamp': timezone.now(),
        'user': request.user.username
    })


#
