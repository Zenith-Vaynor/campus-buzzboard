from rest_framework import viewsets
from rest_framework.response import Response
from .models import User, Notice, Event
from .serializers import UserSerializer, NoticeSerializer, EventSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class NoticeViewSet(viewsets.ModelViewSet):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer

    def list(self, request, *args, **kwargs):
        notices = list(self.get_queryset())
        notices.sort(key=lambda x: x.heat_score, reverse=True)
        serializer = self.get_serializer(notices, many=True)
        return Response(serializer.data)

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def list(self, request, *args, **kwargs):
        events = list(self.get_queryset())
        events.sort(key=lambda x: x.heat_score, reverse=True)
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)