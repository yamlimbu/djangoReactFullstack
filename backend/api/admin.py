from django.contrib import admin
from .models import (
    UserProfile, Channel, SyncJob, Video, VideoStatistics, Comment,
    AnalyticsMetric, PerformancePrediction, ContentRecommendation,
    Dashboard, Report, Alert, Notification, SystemLog, APIUsage,
    SystemConfiguration
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'is_email_verified', 'two_factor_enabled', 'api_quota_used', 'created_at']
    list_filter = ['is_email_verified', 'two_factor_enabled', 'created_at']
    search_fields = ['user__username', 'user__email']


@admin.register(Channel)
class ChannelAdmin(admin.ModelAdmin):
    list_display = ['channel_name', 'user', 'subscriber_count', 'video_count', 'view_count', 'is_active', 'last_synced']
    list_filter = ['is_active', 'created_at', 'last_synced']
    search_fields = ['channel_name', 'youtube_channel_id', 'user__username']
    readonly_fields = ['youtube_channel_id', 'created_at', 'updated_at']


@admin.register(SyncJob)
class SyncJobAdmin(admin.ModelAdmin):
    list_display = ['channel', 'job_type', 'status', 'priority', 'created_at', 'completed_at']
    list_filter = ['status', 'priority', 'job_type', 'created_at']
    search_fields = ['channel__channel_name']
    readonly_fields = ['created_at', 'started_at', 'completed_at']


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'channel', 'view_count', 'like_count', 'comment_count', 'engagement_rate', 'published_at']
    list_filter = ['channel', 'is_active', 'published_at', 'created_at']
    search_fields = ['title', 'youtube_video_id', 'channel__channel_name']
    readonly_fields = ['youtube_video_id', 'engagement_rate', 'like_ratio', 'created_at', 'last_updated']


@admin.register(VideoStatistics)
class VideoStatisticsAdmin(admin.ModelAdmin):
    list_display = ['video', 'date', 'views', 'likes', 'comments']
    list_filter = ['date', 'video__channel']
    search_fields = ['video__title']
    readonly_fields = ['created_at']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['author_name', 'video', 'sentiment_label', 'sentiment_score', 'like_count', 'published_at']
    list_filter = ['sentiment_label', 'published_at', 'video__channel']
    search_fields = ['author_name', 'text_display', 'video__title']
    readonly_fields = ['youtube_comment_id', 'created_at']


@admin.register(AnalyticsMetric)
class AnalyticsMetricAdmin(admin.ModelAdmin):
    list_display = ['channel', 'date', 'total_views', 'engagement_rate', 'total_subscribers', 'subscriber_growth_rate']
    list_filter = ['channel', 'date']
    search_fields = ['channel__channel_name']
    readonly_fields = ['created_at']


@admin.register(PerformancePrediction)
class PerformancePredictionAdmin(admin.ModelAdmin):
    list_display = ['video', 'predicted_final_views', 'confidence_score', 'accuracy', 'prediction_date']
    list_filter = ['prediction_date']
    search_fields = ['video__title']
    readonly_fields = ['prediction_date']


@admin.register(ContentRecommendation)
class ContentRecommendationAdmin(admin.ModelAdmin):
    list_display = ['channel', 'recommendation_type', 'confidence_score', 'created_at']
    list_filter = ['recommendation_type', 'channel', 'created_at']
    search_fields = ['channel__channel_name', 'recommendation_text']
    readonly_fields = ['created_at']


@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'is_default', 'created_at']
    list_filter = ['is_default', 'created_at']
    search_fields = ['name', 'user__username']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ['report_name', 'user', 'template', 'format', 'is_scheduled', 'generated_at']
    list_filter = ['template', 'format', 'is_scheduled', 'created_at']
    search_fields = ['report_name', 'user__username']
    readonly_fields = ['created_at', 'generated_at']


@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ['alert_name', 'user', 'alert_type', 'metric', 'condition', 'threshold_value', 'is_active']
    list_filter = ['alert_type', 'is_active', 'created_at']
    search_fields = ['alert_name', 'user__username']
    readonly_fields = ['created_at', 'last_triggered_at']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['title', 'user__username']
    readonly_fields = ['created_at']


@admin.register(SystemLog)
class SystemLogAdmin(admin.ModelAdmin):
    list_display = ['action', 'user', 'log_level', 'ip_address', 'created_at']
    list_filter = ['log_level', 'created_at']
    search_fields = ['action', 'user__username']
    readonly_fields = ['created_at']


@admin.register(APIUsage)
class APIUsageAdmin(admin.ModelAdmin):
    list_display = ['endpoint', 'method', 'user', 'status_code', 'response_time_ms', 'created_at']
    list_filter = ['method', 'status_code', 'created_at']
    search_fields = ['endpoint', 'user__username']
    readonly_fields = ['created_at']


@admin.register(SystemConfiguration)
class SystemConfigurationAdmin(admin.ModelAdmin):
    list_display = ['key', 'value', 'updated_at']
    search_fields = ['key']
    readonly_fields = ['updated_at']
