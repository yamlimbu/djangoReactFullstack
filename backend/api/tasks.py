from celery import shared_task
from django.utils import timezone
from api.models import Channel, SyncJob, Alert, Notification, AnalyticsMetric
from api.youtube_service import YouTubeDataCollector
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3)
def sync_channel_task(self, channel_id, job_id=None):
    """
    Background task to sync a specific YouTube channel
    """
    logger.info(f"Starting background sync for channel: {channel_id}")
    
    if job_id:
        try:
            job = SyncJob.objects.get(id=job_id)
            job.status = 'processing'
            job.started_at = timezone.now()
            job.save()
        except SyncJob.DoesNotExist:
            job = None

    try:
        collector = YouTubeDataCollector()
        success = collector.collect_channel_data(channel_id)
        
        if success:
            try:
                channel = Channel.objects.get(youtube_channel_id=channel_id)
                channel.last_synced = timezone.now()
                channel.save()
                
                # Run sentiment analysis on new comments
                from api.ml_models import SentimentAnalyzer
                from api.models import Video
                for video in Video.objects.filter(channel=channel):
                    SentimentAnalyzer.analyze_video_comments(video.id)
                    
            except Channel.DoesNotExist:
                pass
            
            if job:
                job.status = 'completed'
                job.completed_at = timezone.now()
                job.save()
            return f"Successfully synced channel {channel_id}"
        else:
            if job:
                job.status = 'failed'
                job.error_message = "Failed to collect channel data"
                job.completed_at = timezone.now()
                job.save()
            return f"Failed to sync channel {channel_id}"
            
    except Exception as e:
        logger.error(f"Error in sync_channel_task: {str(e)}")
        if job:
            job.status = 'failed'
            job.error_message = str(e)
            job.completed_at = timezone.now()
            job.save()
        raise self.retry(exc=e, countdown=60)

@shared_task
def sync_all_channels():
    """
    Periodic task to sync all active channels
    """
    active_channels = Channel.objects.filter(is_active=True)
    for channel in active_channels:
        # Create a job record
        job = SyncJob.objects.create(
            channel=channel,
            job_type='channel',
            status='pending',
            priority='medium'
        )
        # Queue the specific channel task
        sync_channel_task.delay(channel.youtube_channel_id, job.id)
    
    return f"Queued {active_channels.count()} channels for syncing"

@shared_task
def evaluate_system_alerts():
    """
    Periodic task to evaluate all active alerts against latest metrics
    """
    active_alerts = Alert.objects.filter(is_active=True)
    alerts_triggered = 0
    
    for alert in active_alerts:
        # Get latest metric for the channel (or system-wide if channel is None)
        if alert.channel:
            latest_metric = AnalyticsMetric.objects.filter(channel=alert.channel).order_by('-date').first()
        else:
            # Aggregate or get system wide metric
            latest_metric = AnalyticsMetric.objects.order_by('-date').first()
            
        if not latest_metric:
            continue
            
        # Get the actual value to compare
        value = getattr(latest_metric, alert.metric, None)
        if value is None:
            continue
            
        # Evaluate condition
        triggered = False
        if alert.condition == '>' and value > alert.threshold_value: triggered = True
        elif alert.condition == '<' and value < alert.threshold_value: triggered = True
        elif alert.condition == '=' and value == alert.threshold_value: triggered = True
        elif alert.condition == '>=' and value >= alert.threshold_value: triggered = True
        elif alert.condition == '<=' and value <= alert.threshold_value: triggered = True
        
        if triggered:
            # Check if we should notify (avoid spamming)
            if not alert.last_triggered_at or (timezone.now() - alert.last_triggered_at).total_seconds() > 3600 * 24:
                Notification.objects.create(
                    user=alert.user,
                    notification_type='alert',
                    title=f"Alert Triggered: {alert.alert_name}",
                    message=f"The metric {alert.metric} has reached {value}, which is {alert.condition} {alert.threshold_value}.",
                    related_alert=alert
                )
                alert.last_triggered_at = timezone.now()
                alert.save()
                alerts_triggered += 1
                
    return f"Evaluated {active_alerts.count()} alerts, triggered {alerts_triggered}."


@shared_task
def generate_report_task(report_id):
    """
    Background task to generate analytical reports using Pandas
    """
    from api.models import Report, Video, Channel
    import pandas as pd
    import os
    from django.conf import settings
    
    try:
        report = Report.objects.get(id=report_id)
        
        # Determine data source based on template
        if report.template == 'video_performance':
            if report.channel:
                videos = Video.objects.filter(channel=report.channel).values(
                    'title', 'published_at', 'view_count', 'like_count', 'comment_count', 'engagement_rate'
                )
            else:
                videos = Video.objects.all().values(
                    'title', 'published_at', 'view_count', 'like_count', 'comment_count', 'engagement_rate'
                )
            df = pd.DataFrame(list(videos))
        elif report.template == 'channel_performance':
            channels = Channel.objects.all().values(
                'channel_name', 'subscriber_count', 'video_count', 'view_count'
            )
            df = pd.DataFrame(list(channels))
        else:
            # Default fallback
            df = pd.DataFrame({'message': ['Template not fully implemented yet']})

        # Ensure reports directory exists
        reports_dir = os.path.join(settings.BASE_DIR, 'media', 'reports')
        os.makedirs(reports_dir, exist_ok=True)
        
        file_name = f"report_{report.id}_{timezone.now().strftime('%Y%m%d%H%M%S')}"
        file_path = ""
        
        if report.format == 'csv':
            file_path = os.path.join(reports_dir, f"{file_name}.csv")
            df.to_csv(file_path, index=False)
        elif report.format == 'excel':
            file_path = os.path.join(reports_dir, f"{file_name}.xlsx")
            df.to_excel(file_path, index=False)
        elif report.format == 'pdf':
            # Simplified PDF generation fallback (would normally use reportlab or pdfkit)
            file_path = os.path.join(reports_dir, f"{file_name}.csv")
            df.to_csv(file_path, index=False)
            logger.warning("PDF generation requested, but only CSV generated as fallback.")
            
        report.file_path = file_path
        report.generated_at = timezone.now()
        report.save()
        
        return f"Generated report {report_id} at {file_path}"
    except Exception as e:
        logger.error(f"Error generating report: {str(e)}")
        return f"Error generating report: {str(e)}"
