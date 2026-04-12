# urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Existing Note URLs
    path('notes/', views.NoteListCreate.as_view(), name='note-list'),
    path('notes/update/<int:pk>/', views.NoteUpdateView.as_view(), name='note-update'),
    path('notes/delete/<int:pk>/', views.NoteDelete.as_view(), name='note-delete'),
    
    # User URLs
    path('register/', views.CreateUserView.as_view(), name='register'),
    path('user/profile/', views.UserProfileView.as_view(), name='user-profile'),
    
    # YouTube Analytics URLs (Updated to use database)
    path('youtube/dashboard/', views.YouTubeDashboardView.as_view(), name='youtube-dashboard'),
    path('youtube/analytics/', views.YouTubeDashboardView.as_view(), name='youtube-analytics'),
    path('youtube/videos/', views.VideoAnalyticsView.as_view(), name='video-analytics'),
    path('youtube/trends/', views.AnalyticsTrendsView.as_view(), name='analytics-trends'),
    path('youtube/search/channels/', views.SearchChannelsView.as_view(), name='search-channels'),
    path('youtube/channels/', views.ChannelManagementView.as_view(), name='channel-management'),
    path('youtube/channels/<str:channel_id>/', views.ChannelManagementView.as_view(), name='channel-detail'),
    
    # Dashboard & Summary
    path('dashboard/summary/', views.DashboardSummaryView.as_view(), name='dashboard-summary'),
    
    # System URLs
    path('health/', views.health_check, name='health-check'),
    path('user/stats/', views.user_stats, name='user-stats'),
    path('test/', views.api_test, name='api-test'),
]