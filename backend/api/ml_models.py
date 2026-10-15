"""
Machine Learning Module
Implements prediction models and recommendations
"""

import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from datetime import timedelta
from django.utils import timezone
from .models import Video, VideoStatistics, PerformancePrediction, ContentRecommendation
import logging
import joblib
import os
from django.conf import settings

# Attempt to download VADER lexicon if not present
try:
    import nltk
    from nltk.sentiment.vader import SentimentIntensityAnalyzer
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError:
    import nltk
    nltk.download('vader_lexicon')
    from nltk.sentiment.vader import SentimentIntensityAnalyzer

logger = logging.getLogger(__name__)


class PerformancePredictor:
    """ML-based performance prediction"""

    @staticmethod
    def extract_features(video):
        """Extract features from video for prediction"""
        features = []
        
        # Title length
        features.append(len(video.title))
        
        # Description length
        features.append(len(video.description) if video.description else 0)
        
        # Number of tags
        tags = video.tags.split(',') if video.tags else []
        features.append(len(tags))
        
        # Category ID (encoded)
        features.append(hash(video.category_id) % 100 if video.category_id else 0)
        
        # Day of week (0-6)
        features.append(video.published_at.weekday())
        
        # Hour of day (0-23)
        features.append(video.published_at.hour)
        
        # Current views (normalized)
        features.append(min(video.view_count / 1000000, 1))
        
        # Current likes (normalized)
        features.append(min(video.like_count / 100000, 1))
        
        # Current comments (normalized)
        features.append(min(video.comment_count / 10000, 1))
        
        return np.array(features).reshape(1, -1)

    @staticmethod
    def get_model_path():
        """Get path to the trained model file"""
        model_dir = os.path.join(settings.BASE_DIR, 'models')
        os.makedirs(model_dir, exist_ok=True)
        return os.path.join(model_dir, 'view_predictor_rf.pkl')

    @staticmethod
    def train_view_prediction_model():
        """Train a RandomForest model based on historical data"""
        try:
            videos = Video.objects.filter(view_count__gt=0)
            if videos.count() < 10:
                logger.warning("Not enough data to train model. Need at least 10 videos.")
                return False

            X = []
            y = []

            for video in videos:
                features = PerformancePredictor.extract_features(video)[0]
                X.append(features)
                y.append(video.view_count)

            X = np.array(X)
            y = np.array(y)

            # Scale features
            scaler = StandardScaler()
            X_scaled = scaler.fit_transform(X)

            # Train Random Forest
            model = RandomForestRegressor(n_estimators=100, random_state=42)
            model.fit(X_scaled, y)
            
            # Save model and scaler
            model_path = PerformancePredictor.get_model_path()
            scaler_path = model_path.replace('.pkl', '_scaler.pkl')
            joblib.dump(model, model_path)
            joblib.dump(scaler, scaler_path)

            logger.info("Successfully trained and saved view prediction model")
            return True
        except Exception as e:
            logger.error(f"Error training model: {str(e)}")
            return False

    @staticmethod
    def predict_final_views(video_id):
        """Predict final view count for a video using trained ML model"""
        try:
            video = Video.objects.get(id=video_id)
            
            # Extract features
            features = PerformancePredictor.extract_features(video)
            
            model_path = PerformancePredictor.get_model_path()
            scaler_path = model_path.replace('.pkl', '_scaler.pkl')

            if os.path.exists(model_path) and os.path.exists(scaler_path):
                # Use trained ML model
                model = joblib.load(model_path)
                scaler = joblib.load(scaler_path)
                
                features_scaled = scaler.transform(features)
                predicted_views = max(model.predict(features_scaled)[0], video.view_count)
                
                # Estimate confidence based on random forest trees variance
                preds = np.array([tree.predict(features_scaled)[0] for tree in model.estimators_])
                std_dev = np.std(preds)
                # Lower standard deviation means higher confidence
                confidence = max(0.5, min(0.95, 1.0 - (std_dev / (predicted_views + 1))))
            else:
                # Fallback to heuristic if model not trained yet
                base_views = video.view_count
                engagement_factor = (video.like_count + video.comment_count) / max(video.view_count, 1)
                predicted_views = base_views * (1 + engagement_factor * 0.5)
                days_old = (timezone.now() - video.published_at).days
                if days_old < 7: predicted_views *= 1.5
                elif days_old < 30: predicted_views *= 1.2
                confidence = min(0.95, 0.5 + (days_old / 100))
            
            engagement_rate = (video.like_count + video.comment_count) / max(video.view_count, 1) * 100
            
            # Create prediction record
            prediction, created = PerformancePrediction.objects.update_or_create(
                video_id=video_id,
                defaults={
                    'predicted_final_views': int(predicted_views),
                    'predicted_engagement_rate': engagement_rate,
                    'confidence_score': confidence,
                }
            )
            
            return {
                'predicted_views': int(predicted_views),
                'confidence': confidence,
                'engagement_rate': prediction.predicted_engagement_rate,
            }
        except Exception as e:
            logger.error(f"Error predicting video performance: {str(e)}")
            return None

    @staticmethod
    def predict_engagement_rate(video_id):
        """Predict engagement rate for a video"""
        try:
            video = Video.objects.get(id=video_id)
            
            # Get similar videos
            similar_videos = Video.objects.filter(
                channel=video.channel,
                category_id=video.category_id
            ).exclude(id=video_id)[:10]
            
            if not similar_videos.exists():
                # Use channel average
                channel_avg = Video.objects.filter(
                    channel=video.channel
                ).aggregate(models.Avg('engagement_rate'))['engagement_rate__avg'] or 0
                return channel_avg
            
            # Calculate average engagement rate of similar videos
            avg_engagement = similar_videos.aggregate(
                models.Avg('engagement_rate')
            )['engagement_rate__avg'] or 0
            
            return avg_engagement
        except Exception as e:
            logger.error(f"Error predicting engagement rate: {str(e)}")
            return 0


class RecommendationEngine:
    """AI-powered content recommendations"""

    @staticmethod
    def generate_topic_recommendations(channel_id):
        """Generate topic recommendations based on performance"""
        try:
            from django.db.models import Avg, Sum
            
            videos = Video.objects.filter(channel_id=channel_id)
            
            if not videos.exists():
                return []
            
            # Analyze top performing videos
            top_videos = videos.order_by('-engagement_rate')[:5]
            
            # Extract common tags from top videos
            tag_performance = {}
            for video in top_videos:
                if video.tags:
                    tags = [tag.strip() for tag in video.tags.split(',')]
                    for tag in tags:
                        if tag not in tag_performance:
                            tag_performance[tag] = []
                        tag_performance[tag].append(video.engagement_rate)
            
            # Calculate average engagement for each tag
            tag_scores = {
                tag: np.mean(scores) for tag, scores in tag_performance.items()
            }
            
            # Sort by score and get top recommendations
            recommendations = sorted(tag_scores.items(), key=lambda x: x[1], reverse=True)[:5]
            
            # Create recommendation records
            for tag, score in recommendations:
                ContentRecommendation.objects.create(
                    channel_id=channel_id,
                    recommendation_type='topic',
                    recommendation_text=f"Focus on '{tag}' content - high engagement potential",
                    confidence_score=min(score / 100, 1.0)
                )
            
            return [{'topic': tag, 'confidence': score} for tag, score in recommendations]
        except Exception as e:
            logger.error(f"Error generating topic recommendations: {str(e)}")
            return []

    @staticmethod
    def recommend_posting_time(channel_id):
        """Recommend optimal posting time"""
        try:
            from django.db.models import Avg
            
            videos = Video.objects.filter(channel_id=channel_id)
            
            if not videos.exists():
                return None
            
            # Group videos by hour of day
            hour_performance = {}
            for video in videos:
                hour = video.published_at.hour
                if hour not in hour_performance:
                    hour_performance[hour] = []
                hour_performance[hour].append(video.engagement_rate)
            
            # Calculate average engagement for each hour
            hour_scores = {
                hour: np.mean(scores) for hour, scores in hour_performance.items()
            }
            
            # Find best hour
            best_hour = max(hour_scores.items(), key=lambda x: x[1])[0]
            
            # Create recommendation
            ContentRecommendation.objects.create(
                channel_id=channel_id,
                recommendation_type='posting_time',
                recommendation_text=f"Post videos at {best_hour}:00 for maximum engagement",
                confidence_score=0.8
            )
            
            return {
                'best_hour': best_hour,
                'recommendation': f"Post at {best_hour}:00 UTC"
            }
        except Exception as e:
            logger.error(f"Error recommending posting time: {str(e)}")
            return None

    @staticmethod
    def recommend_video_length(channel_id):
        """Recommend optimal video length"""
        try:
            videos = Video.objects.filter(channel_id=channel_id, duration__isnull=False)
            
            if not videos.exists():
                return None
            
            # Group videos by length ranges
            length_ranges = {
                'short': (0, 300),      # 0-5 minutes
                'medium': (300, 900),   # 5-15 minutes
                'long': (900, 3600),    # 15-60 minutes
                'very_long': (3600, 99999)  # 60+ minutes
            }
            
            range_performance = {}
            for range_name, (min_len, max_len) in length_ranges.items():
                range_videos = videos.filter(duration__gte=min_len, duration__lt=max_len)
                if range_videos.exists():
                    avg_engagement = range_videos.aggregate(
                        models.Avg('engagement_rate')
                    )['engagement_rate__avg'] or 0
                    range_performance[range_name] = avg_engagement
            
            # Find best length range
            if range_performance:
                best_range = max(range_performance.items(), key=lambda x: x[1])[0]
                
                ContentRecommendation.objects.create(
                    channel_id=channel_id,
                    recommendation_type='video_length',
                    recommendation_text=f"Create {best_range} videos for better engagement",
                    confidence_score=0.75
                )
                
                return {
                    'recommended_length': best_range,
                    'recommendation': f"Videos of {best_range} length perform best"
                }
        except Exception as e:
            logger.error(f"Error recommending video length: {str(e)}")
            return None

    @staticmethod
    def get_all_recommendations(channel_id):
        """Get all recommendations for a channel"""
        recommendations = {
            'topics': RecommendationEngine.generate_topic_recommendations(channel_id),
            'posting_time': RecommendationEngine.recommend_posting_time(channel_id),
            'video_length': RecommendationEngine.recommend_video_length(channel_id),
        }
        return recommendations


class AnomalyDetector:
    """Detect anomalies in channel performance"""

    @staticmethod
    def detect_view_anomaly(video_id, threshold=2.0):
        """Detect unusual view patterns"""
        try:
            video = Video.objects.get(id=video_id)
            stats = VideoStatistics.objects.filter(video=video).order_by('-date')[:30]
            
            if len(stats) < 7:
                return None
            
            views = [s.views for s in stats]
            mean_views = np.mean(views)
            std_views = np.std(views)
            
            # Check if recent views are anomalous
            recent_views = views[0]
            z_score = (recent_views - mean_views) / std_views if std_views > 0 else 0
            
            if abs(z_score) > threshold:
                return {
                    'is_anomaly': True,
                    'z_score': z_score,
                    'type': 'spike' if z_score > 0 else 'drop',
                    'severity': min(abs(z_score) / threshold, 1.0)
                }
            
            return {'is_anomaly': False}
        except Exception as e:
            logger.error(f"Error detecting anomaly: {str(e)}")
            return None

    @staticmethod
    def detect_engagement_anomaly(video_id, threshold=2.0):
        """Detect unusual engagement patterns"""
        try:
            video = Video.objects.get(id=video_id)
            
            # Calculate engagement rate over time
            stats = VideoStatistics.objects.filter(video=video).order_by('-date')[:30]
            
            if len(stats) < 7:
                return None
            
            engagement_rates = []
            for stat in stats:
                if stat.views > 0:
                    rate = ((stat.likes + stat.comments) / stat.views) * 100
                    engagement_rates.append(rate)
            
            if not engagement_rates:
                return None
            
            mean_engagement = np.mean(engagement_rates)
            std_engagement = np.std(engagement_rates)
            
            recent_engagement = engagement_rates[0]
            z_score = (recent_engagement - mean_engagement) / std_engagement if std_engagement > 0 else 0
            
            if abs(z_score) > threshold:
                return {
                    'is_anomaly': True,
                    'z_score': z_score,
                    'type': 'high_engagement' if z_score > 0 else 'low_engagement',
                    'severity': min(abs(z_score) / threshold, 1.0)
                }
            
            return {'is_anomaly': False}
        except Exception as e:
            logger.error(f"Error detecting engagement anomaly: {str(e)}")
            return None


class SentimentAnalyzer:
    """Analyze sentiment of comments using NLTK VADER"""
    
    @staticmethod
    def analyze_comment(text):
        """Analyze sentiment of a single text string"""
        try:
            sia = SentimentIntensityAnalyzer()
            scores = sia.polarity_scores(text)
            
            compound = scores['compound']
            
            if compound >= 0.05:
                label = 'positive'
            elif compound <= -0.05:
                label = 'negative'
            else:
                label = 'neutral'
                
            return {
                'label': label,
                'score': compound
            }
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {str(e)}")
            return {'label': 'neutral', 'score': 0.0}

    @staticmethod
    def analyze_video_comments(video_id):
        """Analyze all unanalyzed comments for a video"""
        try:
            from .models import Comment
            
            comments = Comment.objects.filter(video_id=video_id, sentiment_score=0.0, sentiment_label='neutral')
            analyzed = 0
            
            for comment in comments:
                result = SentimentAnalyzer.analyze_comment(comment.text_display)
                comment.sentiment_label = result['label']
                comment.sentiment_score = result['score']
                comment.save()
                analyzed += 1
                
            return analyzed
        except Exception as e:
            logger.error(f"Error analyzing video comments: {str(e)}")
            return 0


from django.db import models
