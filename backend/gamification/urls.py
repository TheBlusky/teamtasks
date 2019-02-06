from django.urls import path

from gamification.views import get_gamification_status, ping_user

urls = [path("", get_gamification_status), path("ping_user/", ping_user)]
