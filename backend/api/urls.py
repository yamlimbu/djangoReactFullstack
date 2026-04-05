from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Module 1: User Authentication & Management
router.register(r'users/profile', views.UserProfileViewSet, basename='user-profile')

# Module 2: YouTube Integration
router.register(r'channels', views.ChannelViewSet, basename='channel')

# Module 3: Data Collection & Synchronization
router.register(r'sync-jobs', views.SyncJobViewSet, basename='sync-job')

# Module 4: Data Processing & ETL
router.register(r'videos', views.VideoViewSet, basename='video')
router.register(r'comments', views.CommentViewSet, basename='comment')

# Module 5: Analytics Engine
router.register(r'analytics-metrics', views.AnalyticsMetricViewSet, basename='analytics-metric')

# Module 6: Machine Learning
router.register(r'predictions', views.PerformancePredictionViewSet, basename='prediction')
router.register(r'recommendations', views.ContentRecommendationViewSet, basename='recommendation')

# Module 7: Visualization & Dashboard
router.register(r'dashboards', views.DashboardViewSet, basename='dashboard')

# Module 8: Reporting Module
router.register(r'reports', views.ReportViewSet, basename='report')

# Module 9: Alert & Notification
router.register(r'alerts', views.AlertViewSet, basename='alert')
router.register(r'notifications', views.NotificationViewSet, basename='notification')

# Module 10: Administration
router.register(r'system-logs', views.SystemLogViewSet, basename='system-log')
router.register(r'api-usage', views.APIUsageViewSet, basename='api-usage')
router.register(r'system-config', views.SystemConfigurationViewSet, basename='system-config')

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    
    # Dashboard summary
    path('dashboard/summary/', views.dashboard_summary, name='dashboard-summary'),
    
    # Health check
    path('health/', views.health_check, name='health-check'),
    
    # Legacy Notes endpoints
    path('notes/', views.NoteListCreate.as_view(), name='note-list-create'),
    path('notes/<int:pk>/', views.NoteDelete.as_view(), name='note-delete'),

    path('youtube/dashboard/', views.youtube_dashboard, name='youtube-dashboard'),
    
    # Router URLs
    path('', include(router.urls)),
]
