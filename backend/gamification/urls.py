from django.urls import path

from gamification.views import get_gamification_status

urls = [path("", get_gamification_status)]
