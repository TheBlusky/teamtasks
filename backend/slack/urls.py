from django.urls import path

from slack.views import slack_view

urls = [path("", slack_view)]
