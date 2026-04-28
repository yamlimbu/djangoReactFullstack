from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile, Channel, SyncJob, Video, VideoStatistics, Comment,
    AnalyticsMetric, PerformancePrediction, ContentRecommendation,
    Dashboard, Report, Alert, Notification, SystemLog, APIUsage,
    SystemConfiguration, Note
)



class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'author', 'created_at']
        read_only_fields = ['author', 'created_at']
        
# ============================================
# MODULE 1: USER AUTHENTICATION & MANAGEMENT
# ============================================

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'id', 'bio', 'profile_picture', 'is_email_verified',
            'two_factor_enabled', 'api_quota_limit', 'api_quota_used',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']
        read_only_fields = ['id']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        return user


# ============================================
# MODULE 2: YOUTUBE INTEGRATION
# ============================================

class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = [
            'id', 'youtube_channel_id', 'channel_name', 'channel_url',
            'description', 'thumbnail_url', 'subscriber_count', 'video_count',
            'view_count', 'last_synced', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_synced']


# ============================================
# MODULE 3: DATA COLLECTION & SYNCHRONIZATION
# ============================================

class SyncJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyncJob
        fields = [
            'id', 'channel', 'job_type', 'status', 'priority',
            'started_at', 'completed_at', 'error_message', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'started_at', 'completed_at']


# ============================================
# MODULE 4: DATA PROCESSING & ETL
# ============================================

class VideoStatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoStatistics
        fields = ['id', 'video', 'date', 'views', 'likes', 'comments', 'created_at']
        read_only_fields = ['id', 'created_at']


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            'id', 'video', 'youtube_comment_id', 'author_name', 'author_id',
            'text_display', 'like_count', 'reply_count', 'sentiment_label',
            'sentiment_score', 'published_at', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'sentiment_label', 'sentiment_score']


class VideoSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    statistics = VideoStatisticsSerializer(many=True, read_only=True)

    class Meta:
        model = Video
        fields = [
            'id', 'channel', 'youtube_video_id', 'title', 'description',
            'published_at', 'duration', 'thumbnail_url', 'category_id', 'tags',
            'view_count', 'like_count', 'comment_count', 'engagement_rate',
            'like_ratio', 'is_active', 'last_updated', 'created_at',
            'comments', 'statistics'
        ]
        read_only_fields = ['id', 'created_at', 'last_updated', 'engagement_rate', 'like_ratio']


# ============================================
# MODULE 5: ANALYTICS ENGINE
# ============================================

class AnalyticsMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsMetric
        fields = [
            'id', 'channel', 'date', 'total_views', 'new_views', 'view_velocity',
            'total_likes', 'total_comments', 'engagement_rate', 'total_subscribers',
            'new_subscribers', 'subscriber_growth_rate', 'estimated_watch_time_hours',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ============================================
# MODULE 6: MACHINE LEARNING
# ============================================

class PerformancePredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformancePrediction
        fields = [
            'id', 'video', 'predicted_final_views', 'predicted_engagement_rate',
            'confidence_score', 'prediction_date', 'actual_final_views', 'accuracy'
        ]
        read_only_fields = ['id', 'prediction_date']


class ContentRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentRecommendation
        fields = [
            'id', 'channel', 'recommendation_type', 'recommendation_text',
            'confidence_score', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


# ============================================
# MODULE 7: VISUALIZATION & DASHBOARD
# ============================================

class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = [
            'id', 'user', 'name', 'description', 'layout', 'is_default',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


# ============================================
# MODULE 8: REPORTING MODULE
# ============================================

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = [
            'id', 'user', 'channel', 'report_name', 'template', 'format',
            'parameters', 'file_path', 'is_scheduled', 'schedule_frequency',
            'generated_at', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'file_path', 'generated_at', 'created_at']


# ============================================
# MODULE 9: ALERT & NOTIFICATION
# ============================================

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = [
            'id', 'user', 'channel', 'alert_name', 'alert_type', 'metric',
            'condition', 'threshold_value', 'is_active', 'last_triggered_at',
            'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'last_triggered_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'notification_type', 'title', 'message', 'is_read',
            'related_alert', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']


# ============================================
# MODULE 10: ADMINISTRATION
# ============================================

class SystemLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemLog
        fields = [
            'id', 'user', 'action', 'log_level', 'details', 'ip_address',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class APIUsageSerializer(serializers.ModelSerializer):
    class Meta:
        model = APIUsage
        fields = [
            'id', 'user', 'endpoint', 'method', 'request_count',
            'response_time_ms', 'status_code', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class SystemConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemConfiguration
        fields = ['id', 'key', 'value', 'description', 'updated_at']
        read_only_fields = ['id', 'updated_at']


#
