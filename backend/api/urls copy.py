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



# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from . import views

# router = DefaultRouter()

# # Module 1: User Authentication & Management
# router.register(r'users/profile', views.UserProfileViewSet, basename='user-profile')

# # Module 2: YouTube Integration
# router.register(r'channels', views.ChannelViewSet, basename='channel')

# # Module 3: Data Collection & Synchronization
# router.register(r'sync-jobs', views.SyncJobViewSet, basename='sync-job')

# # Module 4: Data Processing & ETL
# router.register(r'videos', views.VideoViewSet, basename='video')
# router.register(r'comments', views.CommentViewSet, basename='comment')

# # Module 5: Analytics Engine
# router.register(r'analytics-metrics', views.AnalyticsMetricViewSet, basename='analytics-metric')

# # Module 6: Machine Learning
# router.register(r'predictions', views.PerformancePredictionViewSet, basename='prediction')
# router.register(r'recommendations', views.ContentRecommendationViewSet, basename='recommendation')

# # Module 7: Visualization & Dashboard
# router.register(r'dashboards', views.DashboardViewSet, basename='dashboard')

# # Module 8: Reporting Module
# router.register(r'reports', views.ReportViewSet, basename='report')

# # Module 9: Alert & Notification
# router.register(r'alerts', views.AlertViewSet, basename='alert')
# router.register(r'notifications', views.NotificationViewSet, basename='notification')

# # Module 10: Administration
# router.register(r'system-logs', views.SystemLogViewSet, basename='system-log')
# router.register(r'api-usage', views.APIUsageViewSet, basename='api-usage')
# router.register(r'system-config', views.SystemConfigurationViewSet, basename='system-config')


# urlpatterns = [
#     # =========================
#     # AUTH
#     # =========================

    
#     path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
#     path('auth/login/', views.login_view, name='login'),
#     path('auth/logout/', views.logout_view, name='logout'),

#     # =========================
#     # CORE
#     # =========================
#     path('dashboard/summary/', views.dashboard_summary, name='dashboard-summary'),
#     path('health/', views.health_check, name='health-check'),

#     # =========================
#     # NOTES
#     # =========================
#     path('notes/', views.NoteListCreate.as_view(), name='note-list-create'),
#     path('notes/<int:pk>/', views.NoteDelete.as_view(), name='note-delete'),

#     # =========================
#     # 🔴 YOUTUBE CUSTOM API (CRITICAL FIX)
#     # =========================
#     path('youtube/dashboard/', views.youtube_dashboard, name='youtube-dashboard'),

#     # 👉 Add these (required for your frontend)
#     path('youtube/analytics/', views.youtube_dashboard, name='youtube-analytics'),  # reuse for now
#     path('youtube/videos/', views.VideoViewSet.as_view({'get': 'top_videos'}), name='youtube-videos'),
    
#     # Optional (frontend uses these)
#     path('youtube/search/channels/', views.ChannelViewSet.as_view({'get': 'list'}), name='youtube-search-channels'),
#     path('youtube/export/', views.dashboard_summary, name='youtube-export'),  # placeholder

#     # =========================
#     # DRF ROUTER
#     # =========================
#     path('', include(router.urls)),
# ]