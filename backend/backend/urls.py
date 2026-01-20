from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse  # add this
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

def home(request):
    return HttpResponse("API Running")

urlpatterns = [
    path("", home),  # 👈 add this line

    path("admin/", admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
     
     # JWT Authentication
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),

     # Optional: Token verification
    path('api/token/verify/', TokenObtainPairView.as_view(), name='token_verify'),
]
