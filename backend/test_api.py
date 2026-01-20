import os
import django
import requests
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def test_api():
    print("=" * 60)
    print("COMPREHENSIVE API TEST")
    print("=" * 60)
    
    base_url = "http://localhost:8000"
    
    # Test 1: Health endpoint
    print("\n1. Testing Health Endpoint...")
    try:
        response = requests.get(f"{base_url}/health/")
        if response.status_code == 200:
            print(f"   ✓ Health: {response.json()}")
        else:
            print(f"   ✗ Health failed: {response.status_code}")
    except Exception as e:
        print(f"   ✗ Health error: {e}")
    
    # Test 2: Get JWT token
    print("\n2. Getting JWT Token...")
    username = input("   Enter username: ")
    password = input("   Enter password: ")
    
    try:
        token_response = requests.post(
            f"{base_url}/api/token/",
            json={"username": username, "password": password}
        )
        
        if token_response.status_code == 200:
            tokens = token_response.json()
            access_token = tokens.get('access')
            refresh_token = tokens.get('refresh')
            print(f"   ✓ Token obtained successfully")
            
            headers = {"Authorization": f"Bearer {access_token}"}
            
            # Test 3: YouTube API test endpoint
            print("\n3. Testing YouTube API Connection...")
            try:
                youtube_test = requests.get(
                    f"{base_url}/api/test/",
                    headers=headers
                )
                if youtube_test.status_code == 200:
                    print(f"   ✓ YouTube API: {youtube_test.json().get('message')}")
                else:
                    print(f"   ✗ YouTube API failed: {youtube_test.status_code}")
            except Exception as e:
                print(f"   ✗ YouTube API error: {e}")
            
            # Test 4: Get YouTube analytics
            print("\n4. Testing YouTube Analytics...")
            try:
                analytics = requests.get(
                    f"{base_url}/api/youtube/analytics/?channel_id=UC-2Mn1v6KM5OCdr0mauE0Jg",
                    headers=headers
                )
                if analytics.status_code == 200:
                    data = analytics.json()
                    print(f"   ✓ Analytics received")
                    print(f"   • Channel: {data.get('channel_info', {}).get('title', 'N/A')}")
                    print(f"   • Views: {data.get('statistics', {}).get('total_views', 'N/A'):,}")
                    print(f"   • Subscribers: {data.get('statistics', {}).get('subscribers', 'N/A'):,}")
                else:
                    print(f"   ✗ Analytics failed: {analytics.status_code}")
                    print(f"   Response: {analytics.text[:200]}")
            except Exception as e:
                print(f"   ✗ Analytics error: {e}")
            
            # Test 5: Channel search
            print("\n5. Testing Channel Search...")
            try:
                search = requests.get(
                    f"{base_url}/api/youtube/search/channels/?q=python&max_results=3",
                    headers=headers
                )
                if search.status_code == 200:
                    data = search.json()
                    print(f"   ✓ Found {data.get('total_results', 0)} channels")
                    for i, channel in enumerate(data.get('channels', [])[:2], 1):
                        print(f"   {i}. {channel.get('title', 'N/A')} ({channel.get('statistics', {}).get('subscribers', 'N/A'):,} subs)")
                else:
                    print(f"   ✗ Search failed: {search.status_code}")
            except Exception as e:
                print(f"   ✗ Search error: {e}")
            
            # Test 6: Video search
            print("\n6. Testing Video Search...")
            try:
                videos = requests.get(
                    f"{base_url}/api/youtube/search/videos/?q=django&max_results=3",
                    headers=headers
                )
                if videos.status_code == 200:
                    data = videos.json()
                    print(f"   ✓ Found {data.get('total_results', 0)} videos")
                    for i, video in enumerate(data.get('videos', [])[:2], 1):
                        print(f"   {i}. {video.get('title', 'N/A')} ({video.get('statistics', {}).get('views', 'N/A'):,} views)")
                else:
                    print(f"   ✗ Video search failed: {videos.status_code}")
            except Exception as e:
                print(f"   ✗ Video search error: {e}")
            
            # Test 7: Notes API
            print("\n7. Testing Notes API...")
            try:
                notes = requests.get(
                    f"{base_url}/api/notes/",
                    headers=headers
                )
                if notes.status_code == 200:
                    notes_data = notes.json()
                    if isinstance(notes_data, list):
                        print(f"   ✓ Notes API working ({len(notes_data)} notes)")
                    else:
                        print(f"   ⚠ Notes returned non-array: {type(notes_data)}")
                        print(f"   Data: {notes_data}")
                else:
                    print(f"   ✗ Notes failed: {notes.status_code}")
            except Exception as e:
                print(f"   ✗ Notes error: {e}")
                
        else:
            print(f"   ✗ Token failed: {token_response.status_code}")
            print(f"   Error: {token_response.text}")
            
    except Exception as e:
        print(f"   ✗ Token error: {e}")
    
    print("\n" + "=" * 60)
    print("TEST COMPLETE")
    print("=" * 60)

if __name__ == "__main__":
    test_api()