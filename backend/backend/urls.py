from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

def home(request):
    return HttpResponse("API Running")

urlpatterns = [
    path("", home),
    path("admin/", admin.site.urls),
    
    # JWT Authentication
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path('api/token/verify/', TokenObtainPairView.as_view(), name='token_verify'),
    
    # API routes
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
    # path("api/user/register/", CreateUserView.as_view(), name="register"),  # Duplicate - removed

]
