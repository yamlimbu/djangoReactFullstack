from django.urls import path
from . import views

urlpatterns = [
    # Existing Note URLs
    path('notes/', views.NoteListCreate.as_view(), name='note-list'),
    path('notes/update/<int:pk>/', views.NoteUpdateView.as_view(), name='note-update'),  # NEW
    path('notes/delete/<int:pk>/', views.NoteDelete.as_view(), name='note-delete'),
    
    # User URLs
    path('register/', views.CreateUserView.as_view(), name='register'),  # NEW
    
    # YouTube Analytics URLs
    path('youtube/analytics/', views.YouTubeAnalyticsView.as_view(), name='youtube-analytics'),
    path('youtube/videos/', views.VideoPerformanceView.as_view(), name='video-performance'),
    path('youtube/search/channels/', views.ChannelSearchView.as_view(), name='channel-search'),  # NEW
    path('youtube/search/videos/', views.VideoSearchView.as_view(), name='video-search'),  # NEW
    path('youtube/channel/<str:channel_id>/', views.ChannelDetailsView.as_view(), name='channel-details'),  # NEW
    path('youtube/audience/', views.AudienceDemographicsView.as_view(), name='audience-demographics'),
    path('youtube/revenue/', views.RevenueAnalyticsView.as_view(), name='revenue-analytics'),
    path('youtube/realtime/', views.RealTimeAnalyticsView.as_view(), name='realtime-analytics'),
    path('youtube/export/', views.ExportAnalyticsView.as_view(), name='export-analytics'),
    
    # Dashboard & Summary
    path('dashboard/summary/', views.DashboardSummaryView.as_view(), name='dashboard-summary'),
    # Add this URL pattern
    path('youtube/dashboard/', views.YouTubeDashboardView.as_view(), name='youtube-dashboard'),
    
    # System URLs
    path('health/', views.health_check, name='health-check'),
    path('user/stats/', views.user_stats, name='user-stats'),
    path('test/', views.api_test, name='api-test'),  # NEW
]