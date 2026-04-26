# backend/api/management/commands/sync_youtube_data.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime
import os
import re
import googleapiclient.discovery

# Import from your actual app - it's 'api', not 'your_app'
from api.models import Channel, Video

class Command(BaseCommand):
    help = 'Sync YouTube channel data to database'

    def add_arguments(self, parser):
        parser.add_argument('--channel-id', type=str, required=True, help='YouTube channel ID')
        parser.add_argument('--username', type=str, default='django', help='Username to associate channel with')

    def handle(self, *args, **options):
        channel_id = options['channel_id']
        username = options['username']
        
        self.stdout.write(self.style.SUCCESS(f'Starting sync for channel: {channel_id}'))
        
        # Get or create user
        try:
            user = User.objects.get(username=username)
            self.stdout.write(f'Found user: {username}')
        except User.DoesNotExist:
            self.stdout.write(self.style.WARNING(f'User {username} not found. Creating...'))
            user = User.objects.create_user(
                username=username,
                password='defaultpassword123',
                email=f'{username}@example.com'
            )
            self.stdout.write(self.style.SUCCESS(f'Created user: {username}'))
        
        # Get YouTube API key from environment
        api_key = os.environ.get('YOUTUBE_API_KEY')
        
        # Try to read from .env file in backend directory
        if not api_key:
            env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')
            if os.path.exists(env_path):
                with open(env_path, 'r') as f:
                    for line in f:
                        if line.startswith('YOUTUBE_API_KEY='):
                            api_key = line.split('=')[1].strip()
                            break
            
        if not api_key:
            self.stdout.write(self.style.ERROR('YOUTUBE_API_KEY not set. Please set it in .env file'))
            self.stdout.write('You can get an API key from: https://console.cloud.google.com/')
            return
        
        self.stdout.write(f'API Key found: {api_key[:15]}...')
        
        try:
            # Initialize YouTube API
            youtube = googleapiclient.discovery.build('youtube', 'v3', developerKey=api_key)
            
            # Get channel info
            self.stdout.write('Fetching channel information...')
            channel_response = youtube.channels().list(
                part='statistics,snippet',
                id=channel_id
            ).execute()
            
            if not channel_response.get('items'):
                self.stdout.write(self.style.ERROR(f'Channel {channel_id} not found on YouTube'))
                return
            
            channel_data = channel_response['items'][0]
            stats = channel_data['statistics']
            snippet = channel_data['snippet']
            
            # Create/update channel
            channel, created = Channel.objects.update_or_create(
                youtube_channel_id=channel_id,
                defaults={
                    'user': user,
                    'channel_name': snippet['title'],
                    'channel_url': f"https://youtube.com/channel/{channel_id}",
                    'description': snippet['description'][:500] if snippet['description'] else '',
                    'thumbnail_url': snippet['thumbnails']['high']['url'],
                    'subscriber_count': int(stats.get('subscriberCount', 0)),
                    'video_count': int(stats.get('videoCount', 0)),
                    'view_count': int(stats.get('viewCount', 0)),
                    'last_synced': timezone.now(),
                    'is_active': True
                }
            )
            
            self.stdout.write(self.style.SUCCESS(f'Channel {"created" if created else "updated"}: {channel.channel_name}'))
            self.stdout.write(f'Subscribers: {channel.subscriber_count:,}')
            self.stdout.write(f'Total Views: {channel.view_count:,}')
            self.stdout.write(f'Total Videos: {channel.video_count}')
            
            # Get videos
            self.stdout.write('\nFetching videos...')
            video_ids = []
            next_page_token = None
            
            # Fetch all videos (up to 500 to protect API quota)
            while True:
                videos_response = youtube.search().list(
                    part='id',
                    channelId=channel_id,
                    maxResults=50,
                    type='video',
                    pageToken=next_page_token
                ).execute()
                
                new_ids = [item['id']['videoId'] for item in videos_response.get('items', [])]
                video_ids.extend(new_ids)
                
                next_page_token = videos_response.get('nextPageToken')
                if not next_page_token or len(video_ids) >= 500:
                    break
            
            self.stdout.write(f'Found {len(video_ids)} videos to sync')
            
            if not video_ids:
                self.stdout.write(self.style.WARNING('No videos found for this channel'))
                return
            
            # Get video details
            videos_processed = 0
            for i in range(0, len(video_ids), 50):
                batch_ids = video_ids[i:i+50]
                video_stats = youtube.videos().list(
                    part='statistics,contentDetails,snippet',
                    id=','.join(batch_ids)
                ).execute()
                
                for video_data in video_stats.get('items', []):
                    # Parse duration
                    duration_str = video_data['contentDetails']['duration']
                    duration_seconds = self.parse_duration(duration_str)
                    
                    video, v_created = Video.objects.update_or_create(
                        youtube_video_id=video_data['id'],
                        defaults={
                            'channel': channel,
                            'title': video_data['snippet']['title'],
                            'description': video_data['snippet'].get('description', '')[:1000] if video_data['snippet'].get('description') else '',
                            'published_at': datetime.fromisoformat(video_data['snippet']['publishedAt'].replace('Z', '+00:00')),
                            'duration': duration_seconds,
                            'thumbnail_url': video_data['snippet']['thumbnails']['high']['url'],
                            'view_count': int(video_data['statistics'].get('viewCount', 0)),
                            'like_count': int(video_data['statistics'].get('likeCount', 0)),
                            'comment_count': int(video_data['statistics'].get('commentCount', 0)),
                            'tags': ','.join(video_data['snippet'].get('tags', [])),
                            'is_active': True
                        }
                    )
                    
                    # Calculate engagement rate
                    if video.view_count > 0:
                        video.engagement_rate = ((video.like_count + video.comment_count) / video.view_count) * 100
                        video.save()
                    
                    videos_processed += 1
                    if videos_processed % 10 == 0:
                        self.stdout.write(f'  Processed {videos_processed} videos...')
            
            self.stdout.write(self.style.SUCCESS(f'\n✅ Sync completed! Processed {videos_processed} videos'))
            
            # We explicitly do NOT overwrite channel.video_count here, 
            # as it was correctly pulled from YouTube's total channel statistics earlier.
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {str(e)}'))
            import traceback
            traceback.print_exc()
    
    def parse_duration(self, duration):
        """Convert ISO 8601 duration to seconds"""
        # Handle different duration formats
        if not duration:
            return 0
        
        # Pattern for PT1H2M3S format
        pattern = r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?'
        match = re.match(pattern, duration)
        
        if not match:
            return 0
        
        hours = int(match.group(1)) if match.group(1) else 0
        minutes = int(match.group(2)) if match.group(2) else 0
        seconds = int(match.group(3)) if match.group(3) else 0
        
        return hours * 3600 + minutes * 60 + seconds