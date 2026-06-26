from rest_framework import serializers
from .models import User, Notice, Event

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'role', 'createAt']

class NoticeSerializer(serializers.ModelSerializer):
    heat_score = serializers.ReadOnlyField()
    class Meta:
        model = Notice
        fields = ['id', 'title', 'content', 'category', 'postedBy', 'createdAt', 'heat_score']
    
class EventSerializer(serializers.ModelSerializer):
    heat_score = serializers.ReadOnlyField()
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'category', 'venue', 'startTime', 'endTime', 'organizer', 'createdAt', 'heat_score']
    def validate(self, data):
        if data['startTime'] >= data['endTime']:
            raise serializers.ValidationError({
                "endtime": "BuzzBoard Error: Event end time must come strictly after the start time."
            })
        return data    