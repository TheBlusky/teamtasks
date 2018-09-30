from django.db import models
from django.contrib.postgres.fields import JSONField
import requests

from core.models import WorkDay


class TeamSlack(models.Model):
    team = models.OneToOneField(
        "core.Team", on_delete=models.CASCADE, related_name="team_slack"
    )
    activated = models.BooleanField(default=False)
    url = models.CharField(default="", max_length=512)
    channel = models.CharField(default="", max_length=64)
    users = JSONField(default=dict)

    @classmethod
    def initialize_slack(cls, team):
        team_slack = TeamSlack()
        team_slack.team = team
        team_slack.save()
        return team_slack

    def handle_workday_saved(self, workday: WorkDay):
        if not self.activated:
            return
        user = workday.user
        slack_username = (
            f"<@{self.users[user.id]}>"
            if workday.user_id in self.users
            else user.django_user.username
        )
        if workday.validated_at:
            message = f"{slack_username} just planned a workday :clap::clap::clap:"
        elif workday.planned_at:
            message = f"{slack_username} just finished a workday :clap::clap::clap:"
        else:
            return
        userlevel = user.user_level
        data = {
            "text": message,
            "attachments": [
                {
                    "author_name": "TeamTasks",
                    "color": "good",
                    "fields": [
                        {"title": "Level", "value": userlevel.level, "short": True},
                        {"title": "HP", "value": userlevel.hp, "short": True},
                        {"title": "XP", "value": userlevel.xp, "short": True},
                    ],
                }
            ],
            "username": "Teambot by TeamTasks",
            "channel": self.channel,
        }
        try:
            requests.post(self.url, json=data)
        except requests.exceptions.RequestException:
            pass
