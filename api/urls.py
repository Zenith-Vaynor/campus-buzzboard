from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, NoticeViewSet, EventViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'notices', NoticeViewSet)
router.register(r'events', EventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
