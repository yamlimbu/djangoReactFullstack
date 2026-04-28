"""
YouTube API Integration Module
Handles all YouTube Data API v3 interactions
"""

import googleapiclient.discovery
import googleapiclient.errors
from googleapiclient.errors import HttpError
import os
from django.conf import settings
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class YouTubeService:
    """YouTube API service wrapper"""

    def __init__(self, api_key=None, access_token=None):
        """Initialize YouTube service"""
        self.api_key = api_key or getattr(settings, 'YOUTUBE_API_KEY', os.environ.get('YOUTUBE_API_KEY'))
        self.access_token = access_token
        self.service = None
        self._initialize_service()

    def _initialize_service(self):
        """Initialize YouTube API service"""
        try:
            if self.api_key:
                self.service = googleapiclient.discovery.build(
                    'youtube',
                    'v3',
                    developerKey=self.api_key,
                    cache_discovery=False
                )
            else:
                raise ValueError("YouTube API key not configured")
        except Exception as e:
            logger.error(f"Error initializing YouTube service: {str(e)}")
            raise

    def get_channel_stats(self, channel_id):
        """Get channel statistics"""
        try:
            request = self.service.channels().list(
                part='statistics,snippet,contentDetails',
                id=channel_id
            )
            response = request.execute()

            if not response.get('items'):
                return None

            channel = response['items'][0]
            stats = channel['statistics']
            snippet = channel['snippet']

            return {
                'channel_id': channel_id,
                'title': snippet['title'],
                'description': snippet.get('description', ''),
                'thumbnail': snippet['thumbnails']['high']['url'],
                'subscribers': int(stats.get('subscriberCount', 0)),
                'views': int(stats.get('viewCount', 0)),
                'videos': int(stats.get('videoCount', 0)),
                'custom_url': snippet.get('customUrl', ''),
                'published_at': snippet.get('publishedAt', ''),
            }
        except HttpError as e:
            logger.error(f"YouTube API error: {str(e)}")
            return None

    def get_channel_videos(self, channel_id, max_results=50):
        """Get videos from a channel"""
        try:
            videos = []
            request = self.service.search().list(
                part='id,snippet',
                channelId=channel_id,
                maxResults=min(max_results, 50),
                order='date',
                type='video'
            )

            while request and len(videos) < max_results:
                response = request.execute()

                for item in response.get('items', []):
                    video_id = item['id']['videoId']
                    videos.append({
                        'id': video_id,
                        'title': item['snippet']['title'],
                        'description': item['snippet']['description'],
                        'published_at': item['snippet']['publishedAt'],
                        'thumbnail': item['snippet']['thumbnails']['high']['url'],
                    })

                if len(videos) >= max_results:
                    break

                if 'nextPageToken' in response:
                    request = self.service.search().list(
                        part='id,snippet',
                        channelId=channel_id,
                        maxResults=min(max_results - len(videos), 50),
                        order='date',
                        type='video',
                        pageToken=response['nextPageToken']
                    )
                else:
                    break

            return videos[:max_results]
        except HttpError as e:
            logger.error(f"Error fetching channel videos: {str(e)}")
            return []

    def get_video_stats(self, video_id):
        """Get statistics for a specific video"""
        try:
            request = self.service.videos().list(
                part='statistics,snippet,contentDetails',
                id=video_id
            )
            response = request.execute()

            if not response.get('items'):
                return None

            video = response['items'][0]
            stats = video['statistics']
            snippet = video['snippet']
            content = video['contentDetails']

            return {
                'video_id': video_id,
                'title': snippet['title'],
                'description': snippet.get('description', ''),
                'published_at': snippet['publishedAt'],
                'thumbnail': snippet['thumbnails']['high']['url'],
                'duration': content['duration'],
                'views': int(stats.get('viewCount', 0)),
                'likes': int(stats.get('likeCount', 0)),
                'comments': int(stats.get('commentCount', 0)),
                'category_id': snippet.get('categoryId', ''),
                'tags': snippet.get('tags', []),
            }
        except HttpError as e:
            logger.error(f"Error fetching video stats: {str(e)}")
            return None

    def get_video_comments(self, video_id, max_results=100):
        """Get comments from a video"""
        try:
            comments = []
            request = self.service.commentThreads().list(
                part='snippet',
                videoId=video_id,
                maxResults=min(max_results, 20),
                textFormat='plainText',
                order='relevance'
            )

            while request and len(comments) < max_results:
                response = request.execute()

                for item in response.get('items', []):
                    comment = item['snippet']['topLevelComment']['snippet']
                    comments.append({
                        'id': item['id'],
                        'author': comment['authorDisplayName'],
                        'author_id': comment.get('authorChannelId', {}).get('value', ''),
                        'text': comment['textDisplay'],
                        'likes': comment['likeCount'],
                        'published_at': comment['publishedAt'],
                        'reply_count': item['snippet']['totalReplyCount'],
                    })

                if len(comments) >= max_results:
                    break

                if 'nextPageToken' in response:
                    request = self.service.commentThreads().list(
                        part='snippet',
                        videoId=video_id,
                        maxResults=min(max_results - len(comments), 20),
                        textFormat='plainText',
                        order='relevance',
                        pageToken=response['nextPageToken']
                    )
                else:
                    break

            return comments[:max_results]
        except HttpError as e:
            logger.error(f"Error fetching video comments: {str(e)}")
            return []

    def search_channels(self, query, max_results=10):
        """Search for YouTube channels"""
        try:
            channels = []
            request = self.service.search().list(
                part='snippet',
                q=query,
                maxResults=min(max_results, 50),
                type='channel'
            )

            response = request.execute()

            for item in response.get('items', []):
                channel_id = item['snippet']['channelId']
                
                # Get channel statistics
                stats_response = self.service.channels().list(
                    part='statistics',
                    id=channel_id
                ).execute()

                stats = stats_response['items'][0]['statistics'] if stats_response.get('items') else {}

                channels.append({
                    'id': channel_id,
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'],
                    'thumbnail': item['snippet']['thumbnails']['high']['url'],
                    'subscribers': int(stats.get('subscriberCount', 0)),
                    'videos': int(stats.get('videoCount', 0)),
                    'views': int(stats.get('viewCount', 0)),
                })

            return channels[:max_results]
        except HttpError as e:
            logger.error(f"Error searching channels: {str(e)}")
            return []

    def search_videos(self, query, max_results=10):
        """Search for YouTube videos"""
        try:
            videos = []
            request = self.service.search().list(
                part='snippet',
                q=query,
                maxResults=min(max_results, 50),
                type='video',
                order='viewCount'
            )

            response = request.execute()
            video_ids = [item['id']['videoId'] for item in response.get('items', [])]

            if video_ids:
                # Get video statistics
                stats_response = self.service.videos().list(
                    part='statistics,contentDetails',
                    id=','.join(video_ids)
                ).execute()

                stats_map = {item['id']: item for item in stats_response.get('items', [])}

                for item in response.get('items', []):
                    video_id = item['id']['videoId']
                    stats = stats_map.get(video_id, {})

                    videos.append({
                        'id': video_id,
                        'title': item['snippet']['title'],
                        'description': item['snippet']['description'],
                        'channel_title': item['snippet']['channelTitle'],
                        'channel_id': item['snippet']['channelId'],
                        'published_at': item['snippet']['publishedAt'],
                        'thumbnail': item['snippet']['thumbnails']['high']['url'],
                        'views': int(stats.get('statistics', {}).get('viewCount', 0)),
                        'likes': int(stats.get('statistics', {}).get('likeCount', 0)),
                        'comments': int(stats.get('statistics', {}).get('commentCount', 0)),
                        'duration': stats.get('contentDetails', {}).get('duration', ''),
                    })

            return videos[:max_results]
        except HttpError as e:
            logger.error(f"Error searching videos: {str(e)}")
            return []

    def get_trending_videos(self, region_code='US', max_results=10):
        """Get trending videos for a region"""
        try:
            request = self.service.videos().list(
                part='snippet,statistics',
                chart='mostPopular',
                regionCode=region_code,
                maxResults=min(max_results, 50)
            )

            response = request.execute()
            videos = []

            for item in response.get('items', []):
                videos.append({
                    'id': item['id'],
                    'title': item['snippet']['title'],
                    'channel_title': item['snippet']['channelTitle'],
                    'views': int(item['statistics'].get('viewCount', 0)),
                    'likes': int(item['statistics'].get('likeCount', 0)),
                    'comments': int(item['statistics'].get('commentCount', 0)),
                })

            return videos[:max_results]
        except HttpError as e:
            logger.error(f"Error fetching trending videos: {str(e)}")
            return []

    def get_video_categories(self, region_code='US'):
        """Get video categories for a region"""
        try:
            request = self.service.videoCategories().list(
                part='snippet',
                regionCode=region_code,
                hl='en'
            )

            response = request.execute()
            categories = {}

            for item in response.get('items', []):
                categories[item['id']] = item['snippet']['title']

            return categories
        except HttpError as e:
            logger.error(f"Error fetching video categories: {str(e)}")
            return {}


class YouTubeDataCollector:
    """Automated data collection from YouTube"""

    def __init__(self, api_key=None):
        """Initialize data collector"""
        self.service = YouTubeService(api_key=api_key)

    def collect_channel_data(self, channel_id):
        """Collect all data for a channel"""
        try:
            from .models import Channel, Video, Comment, VideoStatistics
            from django.utils import timezone

            # Get channel stats
            channel_data = self.service.get_channel_stats(channel_id)
            if not channel_data:
                return False

            # Get videos
            videos_data = self.service.get_channel_videos(channel_id, max_results=50)

            for video_data in videos_data:
                # Get video stats
                video_stats = self.service.get_video_stats(video_data['id'])
                if not video_stats:
                    continue

                # Create or update video
                video, created = Video.objects.update_or_create(
                    youtube_video_id=video_data['id'],
                    defaults={
                        'title': video_stats['title'],
                        'description': video_stats['description'],
                        'published_at': video_stats['published_at'],
                        'duration': video_stats['duration'],
                        'thumbnail_url': video_stats['thumbnail'],
                        'view_count': video_stats['views'],
                        'like_count': video_stats['likes'],
                        'comment_count': video_stats['comments'],
                        'category_id': video_stats['category_id'],
                        'tags': ','.join(video_stats['tags']),
                    }
                )

                # Create daily statistics record
                VideoStatistics.objects.update_or_create(
                    video=video,
                    date=timezone.now().date(),
                    defaults={
                        'views': video_stats['views'],
                        'likes': video_stats['likes'],
                        'comments': video_stats['comments'],
                    }
                )

                # Get and store comments
                comments_data = self.service.get_video_comments(video_data['id'], max_results=100)
                for comment_data in comments_data:
                    Comment.objects.update_or_create(
                        youtube_comment_id=comment_data['id'],
                        defaults={
                            'video': video,
                            'author_name': comment_data['author'],
                            'author_id': comment_data['author_id'],
                            'text_display': comment_data['text'],
                            'like_count': comment_data['likes'],
                            'reply_count': comment_data['reply_count'],
                            'published_at': comment_data['published_at'],
                        }
                    )

            logger.info(f"Successfully collected data for channel {channel_id}")
            return True
        except Exception as e:
            logger.error(f"Error collecting channel data: {str(e)}")
            return False
