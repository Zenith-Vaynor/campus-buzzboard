from django.db import models
from django.utils import timezone
import math

class User(models.Model):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('admin', 'Admin'),
    )
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    createAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.role})"
    
class Notice(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=50)
    postedBy = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notices')
    createdAt = models.DateTimeField(auto_now_add=True)

    @property
    def heat_score(self):
        age_in_hours = (timezone.now() - self.createdAt).total_seconds() / 3600
        score = max(0, 100-int(age_in_hours*2))
        return score
    
    def __str__(self):
        return self.title

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=50)
    venue = models.CharField(max_length=200)
    startTime = models.DateTimeField()
    endTime = models.DateTimeField()
    organizer = models.CharField(max_length=100)
    createdAt = models.DateTimeField(auto_now_add=True)

    @property
    def heat_score(self):
        now = timezone.now()
        if self.endTime < now:
            return 0
        hours_until_start = (self.startTime - now).total_seconds()/3600
        if hours_until_start <= 0:
            return 100
        elif hours_until_start < 48:
            return min(99, int(100*math.exp(-0.05*hours_until_start)))
        else:
            return 10
    
    def __str__(self):
        return self.title