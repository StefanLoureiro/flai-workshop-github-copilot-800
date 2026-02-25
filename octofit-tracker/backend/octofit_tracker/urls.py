"""octofit_tracker URL Configuration"""
import os
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from octofit_tracker.views import (
    api_root, UserViewSet, TeamViewSet, ActivityViewSet,
    LeaderboardViewSet, WorkoutViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'leaderboard', LeaderboardViewSet)
router.register(r'workouts', WorkoutViewSet)

# Build the public base URL from the Codespace environment variable so that
# browsable-API links and api_root responses use the correct HTTPS origin.
codespace_name = os.environ.get('CODESPACE_NAME')
if codespace_name:
    base_url = f"https://{codespace_name}-8000.app.github.dev"
else:
    base_url = "http://localhost:8000"

# Expose base_url via Django settings so other modules can reference it.
from django.conf import settings as django_settings
if not hasattr(django_settings, 'API_BASE_URL'):
    django_settings.API_BASE_URL = base_url

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', api_root, name='api-root-home'),
    path('api/', api_root, name='api-root'),
    path('api/', include(router.urls)),
]
