"""
Data Processing and ETL Module
Handles data cleaning, normalization, and transformation
"""

import pandas as pd
import numpy as np
from datetime import timedelta
from django.utils import timezone
from .models import Video, VideoStatistics, Comment, AnalyticsMetric
import logging

logger = logging.getLogger(__name__)


class DataProcessor:
    """Data processing and ETL operations"""

    @staticmethod
    def process_video_statistics(video_id):
        """Process and calculate video statistics"""
        try:
            video = Video.objects.get(id=video_id)
            stats = VideoStatistics.objects.filter(video=video).order_by('-date')

            if not stats.exists():
                return None

            # Calculate metrics
            total_views = stats.aggregate(models.Sum('views'))['views__sum'] or 0
            total_likes = stats.aggregate(models.Sum('likes'))['likes__sum'] or 0
            total_comments = stats.aggregate(models.Sum('comments'))['comments__sum'] or 0

            # Update video engagement metrics
            if total_views > 0:
                video.engagement_rate = ((total_likes + total_comments) / total_views) * 100
                video.like_ratio = (total_likes / total_views) * 100
                video.save()

            return {
                'total_views': total_views,
                'total_likes': total_likes,
                'total_comments': total_comments,
                'engagement_rate': video.engagement_rate,
                'like_ratio': video.like_ratio,
            }
        except Exception as e:
            logger.error(f"Error processing video statistics: {str(e)}")
            return None

    @staticmethod
    def clean_comment_text(text):
        """Clean and normalize comment text"""
        if not text:
            return ""
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        # Remove special characters but keep basic punctuation
        text = ''.join(c for c in text if c.isalnum() or c.isspace() or c in '.,!?-')
        
        return text.strip()

    @staticmethod
    def detect_outliers(data, column, threshold=1.5):
        """Detect outliers using IQR method"""
        Q1 = data[column].quantile(0.25)
        Q3 = data[column].quantile(0.75)
        IQR = Q3 - Q1
        
        lower_bound = Q1 - threshold * IQR
        upper_bound = Q3 + threshold * IQR
        
        return data[(data[column] < lower_bound) | (data[column] > upper_bound)]

    @staticmethod
    def aggregate_channel_metrics(channel_id, date):
        """Aggregate daily metrics for a channel"""
        try:
            from django.db.models import Sum, Avg, Count
            
            videos = Video.objects.filter(channel_id=channel_id)
            
            # Get statistics for the date
            stats = VideoStatistics.objects.filter(
                video__in=videos,
                date=date
            )
            
            total_views = stats.aggregate(Sum('views'))['views__sum'] or 0
            total_likes = stats.aggregate(Sum('likes'))['likes__sum'] or 0
            total_comments = stats.aggregate(Sum('comments'))['comments__sum'] or 0
            
            # Get subscriber count from latest channel data
            channel = videos.first().channel if videos.exists() else None
            subscribers = channel.subscriber_count if channel else 0
            
            # Calculate engagement rate
            engagement_rate = ((total_likes + total_comments) / total_views * 100) if total_views > 0 else 0
            
            # Create or update analytics metric
            metric, created = AnalyticsMetric.objects.update_or_create(
                channel_id=channel_id,
                date=date,
                defaults={
                    'total_views': total_views,
                    'total_likes': total_likes,
                    'total_comments': total_comments,
                    'engagement_rate': engagement_rate,
                    'total_subscribers': subscribers,
                }
            )
            
            return metric
        except Exception as e:
            logger.error(f"Error aggregating channel metrics: {str(e)}")
            return None

    @staticmethod
    def calculate_growth_rate(current_value, previous_value):
        """Calculate growth rate percentage"""
        if previous_value == 0:
            return 0 if current_value == 0 else 100
        return ((current_value - previous_value) / previous_value) * 100

    @staticmethod
    def normalize_data(data, min_val=0, max_val=1):
        """Normalize data to a specific range"""
        if len(data) == 0:
            return data
        
        data_min = min(data)
        data_max = max(data)
        
        if data_max == data_min:
            return [min_val] * len(data)
        
        normalized = [
            min_val + (x - data_min) / (data_max - data_min) * (max_val - min_val)
            for x in data
        ]
        
        return normalized


class SentimentAnalyzer:
    """Sentiment analysis for comments"""

    @staticmethod
    def analyze_sentiment(text):
        """
        Analyze sentiment of text
        Returns: (sentiment_label, sentiment_score)
        """
        try:
            from textblob import TextBlob
            
            analysis = TextBlob(text)
            polarity = analysis.sentiment.polarity
            
            if polarity > 0.1:
                return 'positive', polarity
            elif polarity < -0.1:
                return 'negative', polarity
            else:
                return 'neutral', polarity
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {str(e)}")
            return 'neutral', 0.0

    @staticmethod
    def batch_analyze_comments(comment_ids):
        """Analyze sentiment for multiple comments"""
        comments = Comment.objects.filter(id__in=comment_ids)
        
        for comment in comments:
            sentiment_label, sentiment_score = SentimentAnalyzer.analyze_sentiment(
                comment.text_display
            )
            comment.sentiment_label = sentiment_label
            comment.sentiment_score = sentiment_score
            comment.save()
        
        return len(comments)

    @staticmethod
    def get_sentiment_summary(video_id):
        """Get sentiment summary for a video"""
        comments = Comment.objects.filter(video_id=video_id)
        
        total = comments.count()
        if total == 0:
            return {
                'total_comments': 0,
                'positive': 0,
                'negative': 0,
                'neutral': 0,
                'average_sentiment': 0,
            }
        
        positive = comments.filter(sentiment_label='positive').count()
        negative = comments.filter(sentiment_label='negative').count()
        neutral = comments.filter(sentiment_label='neutral').count()
        
        avg_sentiment = comments.aggregate(models.Avg('sentiment_score'))['sentiment_score__avg'] or 0
        
        return {
            'total_comments': total,
            'positive': positive,
            'negative': negative,
            'neutral': neutral,
            'positive_percentage': (positive / total * 100) if total > 0 else 0,
            'negative_percentage': (negative / total * 100) if total > 0 else 0,
            'neutral_percentage': (neutral / total * 100) if total > 0 else 0,
            'average_sentiment': avg_sentiment,
        }


class TrendAnalyzer:
    """Trend detection and analysis"""

    @staticmethod
    def detect_trend(values, window_size=7):
        """
        Detect trend using moving average
        Returns: 'increasing', 'decreasing', or 'stable'
        """
        if len(values) < window_size:
            return 'stable'
        
        # Calculate moving averages
        ma_early = np.mean(values[:window_size])
        ma_late = np.mean(values[-window_size:])
        
        change_percent = ((ma_late - ma_early) / ma_early * 100) if ma_early != 0 else 0
        
        if change_percent > 5:
            return 'increasing'
        elif change_percent < -5:
            return 'decreasing'
        else:
            return 'stable'

    @staticmethod
    def calculate_trend_strength(values):
        """Calculate trend strength (0 to 1)"""
        if len(values) < 2:
            return 0
        
        # Use linear regression to calculate trend strength
        x = np.arange(len(values))
        y = np.array(values)
        
        # Calculate correlation coefficient
        correlation = np.corrcoef(x, y)[0, 1]
        
        return abs(correlation) if not np.isnan(correlation) else 0

    @staticmethod
    def identify_seasonal_patterns(channel_id, days=365):
        """Identify seasonal patterns in channel performance"""
        try:
            from django.db.models import Sum
            
            end_date = timezone.now().date()
            start_date = end_date - timedelta(days=days)
            
            metrics = AnalyticsMetric.objects.filter(
                channel_id=channel_id,
                date__gte=start_date,
                date__lte=end_date
            ).order_by('date')
            
            # Group by month
            monthly_data = {}
            for metric in metrics:
                month = metric.date.strftime('%m')
                if month not in monthly_data:
                    monthly_data[month] = []
                monthly_data[month].append(metric.total_views)
            
            # Calculate average for each month
            seasonal_pattern = {
                month: np.mean(views) for month, views in monthly_data.items()
            }
            
            return seasonal_pattern
        except Exception as e:
            logger.error(f"Error identifying seasonal patterns: {str(e)}")
            return {}


from django.db import models
