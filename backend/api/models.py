from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# ============================================
# MODULE 1: USER AUTHENTICATION & MANAGEMENT
# ============================================

class UserProfile(models.Model):
    """Extended user profile"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.URLField(blank=True, null=True)
    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=255, blank=True, null=True)
    two_factor_enabled = models.BooleanField(default=False)
    api_quota_limit = models.IntegerField(default=10000)
    api_quota_used = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.username}"


# ============================================
# MODULE 2: YOUTUBE INTEGRATION
# ============================================

class Channel(models.Model):
    """YouTube Channel Information"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='channels')
    youtube_channel_id = models.CharField(max_length=100, unique=True)
    channel_name = models.CharField(max_length=255)
    channel_url = models.URLField()
    description = models.TextField(blank=True, null=True)
    thumbnail_url = models.URLField(blank=True, null=True)
    
    # Statistics
    subscriber_count = models.IntegerField(default=0)
    video_count = models.IntegerField(default=0)
    view_count = models.BigIntegerField(default=0)
    
    # OAuth Tokens
    access_token = models.TextField(blank=True, null=True)
    refresh_token = models.TextField(blank=True, null=True)
    token_expiry = models.DateTimeField(blank=True, null=True)
    
    # Sync Information
    last_synced = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.channel_name


# ============================================
# MODULE 3: DATA COLLECTION & SYNCHRONIZATION
# ============================================

class SyncJob(models.Model):
    """Background sync job tracking"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='sync_jobs')
    job_type = models.CharField(max_length=50)  # 'channel', 'videos', 'comments'
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    
    started_at = models.DateTimeField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    error_message = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.job_type} - {self.status}"


# ============================================
# MODULE 4: DATA PROCESSING & ETL
# ============================================

class Video(models.Model):
    """YouTube Video Information"""
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='videos')
    youtube_video_id = models.CharField(max_length=100, unique=True)
    
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True, null=True)
    published_at = models.DateTimeField()
    
    # Video Details
    duration = models.IntegerField(blank=True, null=True)  # in seconds
    thumbnail_url = models.URLField(blank=True, null=True)
    category_id = models.CharField(max_length=50, blank=True, null=True)
    tags = models.TextField(blank=True, null=True)  # comma-separated
    
    # Statistics
    view_count = models.IntegerField(default=0)
    like_count = models.IntegerField(default=0)
    comment_count = models.IntegerField(default=0)
    
    # Engagement Metrics (calculated)
    engagement_rate = models.FloatField(default=0.0)
    like_ratio = models.FloatField(default=0.0)
    
    # Status
    is_active = models.BooleanField(default=True)
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return self.title

    def calculate_engagement_rate(self):
        """Calculate engagement rate"""
        if self.view_count > 0:
            self.engagement_rate = ((self.like_count + self.comment_count) / self.view_count) * 100
            self.like_ratio = (self.like_count / self.view_count) * 100
            self.save()


class VideoStatistics(models.Model):
    """Daily video statistics tracking"""
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='statistics')
    date = models.DateField()
    
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('video', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.video.title} - {self.date}"


class Comment(models.Model):
    """YouTube Comments with Sentiment Analysis"""
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='comments')
    youtube_comment_id = models.CharField(max_length=100, unique=True)
    
    author_name = models.CharField(max_length=255)
    author_id = models.CharField(max_length=100, blank=True, null=True)
    text_display = models.TextField()
    
    like_count = models.IntegerField(default=0)
    reply_count = models.IntegerField(default=0)
    
    # Sentiment Analysis (Module 6)
    SENTIMENT_CHOICES = [
        ('positive', 'Positive'),
        ('negative', 'Negative'),
        ('neutral', 'Neutral'),
    ]
    sentiment_label = models.CharField(max_length=20, choices=SENTIMENT_CHOICES, default='neutral')
    sentiment_score = models.FloatField(default=0.0)  # -1 to 1
    
    published_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return f"Comment by {self.author_name}"


# ============================================
# MODULE 5: ANALYTICS ENGINE
# ============================================

class AnalyticsMetric(models.Model):
    """Calculated analytics metrics"""
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='analytics_metrics')
    date = models.DateField()
    
    # View Metrics
    total_views = models.IntegerField(default=0)
    new_views = models.IntegerField(default=0)
    view_velocity = models.FloatField(default=0.0)  # views per day
    
    # Engagement Metrics
    total_likes = models.IntegerField(default=0)
    total_comments = models.IntegerField(default=0)
    engagement_rate = models.FloatField(default=0.0)
    
    # Subscriber Metrics
    total_subscribers = models.IntegerField(default=0)
    new_subscribers = models.IntegerField(default=0)
    subscriber_growth_rate = models.FloatField(default=0.0)
    
    # Watch Time
    estimated_watch_time_hours = models.FloatField(default=0.0)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('channel', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"Analytics - {self.channel.channel_name} - {self.date}"


# ============================================
# MODULE 6: MACHINE LEARNING
# ============================================

class PerformancePrediction(models.Model):
    """ML-based performance predictions"""
    video = models.OneToOneField(Video, on_delete=models.CASCADE, related_name='prediction')
    
    predicted_final_views = models.IntegerField()
    predicted_engagement_rate = models.FloatField()
    confidence_score = models.FloatField()  # 0 to 1
    
    prediction_date = models.DateTimeField(auto_now_add=True)
    actual_final_views = models.IntegerField(blank=True, null=True)
    accuracy = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"Prediction for {self.video.title}"


class ContentRecommendation(models.Model):
    """AI-generated content recommendations"""
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='recommendations')
    
    recommendation_type = models.CharField(max_length=50)  # 'topic', 'length', 'posting_time'
    recommendation_text = models.TextField()
    confidence_score = models.FloatField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.recommendation_type} - {self.channel.channel_name}"


# ============================================
# MODULE 7: VISUALIZATION & DASHBOARD
# ============================================

class Dashboard(models.Model):
    """Custom dashboard configuration"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dashboards')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    
    layout = models.JSONField(default=dict)  # Widget configuration
    is_default = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


# ============================================
# MODULE 8: REPORTING MODULE
# ============================================

class Report(models.Model):
    """Generated reports"""
    FORMAT_CHOICES = [
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('csv', 'CSV'),
    ]
    
    TEMPLATE_CHOICES = [
        ('channel_performance', 'Channel Performance'),
        ('video_performance', 'Video Performance'),
        ('audience_demographics', 'Audience Demographics'),
        ('engagement_analysis', 'Engagement Analysis'),
        ('competitor_analysis', 'Competitor Analysis'),
        ('sentiment_analysis', 'Sentiment Analysis'),
        ('custom', 'Custom'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='reports', blank=True, null=True)
    
    report_name = models.CharField(max_length=255)
    template = models.CharField(max_length=50, choices=TEMPLATE_CHOICES)
    format = models.CharField(max_length=20, choices=FORMAT_CHOICES)
    
    parameters = models.JSONField(default=dict)  # Report parameters
    file_path = models.CharField(max_length=500, blank=True, null=True)
    
    is_scheduled = models.BooleanField(default=False)
    schedule_frequency = models.CharField(max_length=50, blank=True, null=True)  # 'daily', 'weekly', 'monthly'
    
    generated_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.report_name


# ============================================
# MODULE 9: ALERT & NOTIFICATION
# ============================================

class Alert(models.Model):
    """Alert configuration"""
    ALERT_TYPES = [
        ('threshold', 'Threshold'),
        ('anomaly', 'Anomaly'),
        ('milestone', 'Milestone'),
    ]
    
    CONDITIONS = [
        ('>', 'Greater Than'),
        ('<', 'Less Than'),
        ('=', 'Equal To'),
        ('>=', 'Greater Than or Equal'),
        ('<=', 'Less Than or Equal'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='alerts')
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name='alerts', blank=True, null=True)
    
    alert_name = models.CharField(max_length=255)
    alert_type = models.CharField(max_length=50, choices=ALERT_TYPES)
    
    metric = models.CharField(max_length=50)  # 'views', 'subscribers', 'engagement_rate'
    condition = models.CharField(max_length=20, choices=CONDITIONS)
    threshold_value = models.FloatField(blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    last_triggered_at = models.DateTimeField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.alert_name


class Notification(models.Model):
    """User notifications"""
    NOTIFICATION_TYPES = [
        ('alert', 'Alert'),
        ('report', 'Report'),
        ('system', 'System'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    
    title = models.CharField(max_length=255)
    message = models.TextField()
    
    is_read = models.BooleanField(default=False)
    related_alert = models.ForeignKey(Alert, on_delete=models.SET_NULL, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


# ============================================
# MODULE 10: ADMINISTRATION
# ============================================

class SystemLog(models.Model):
    """System activity logging"""
    LOG_LEVELS = [
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('critical', 'Critical'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    action = models.CharField(max_length=255)
    log_level = models.CharField(max_length=20, choices=LOG_LEVELS)
    
    details = models.TextField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.action} - {self.log_level}"


class APIUsage(models.Model):
    """Track API usage for rate limiting"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_usage')
    
    endpoint = models.CharField(max_length=255)
    method = models.CharField(max_length=10)
    
    request_count = models.IntegerField(default=0)
    response_time_ms = models.IntegerField(default=0)
    status_code = models.IntegerField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.method} {self.endpoint}"


class SystemConfiguration(models.Model):
    """System-wide configuration"""
    key = models.CharField(max_length=255, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True, null=True)
    
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.key


class Note(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
