from django.db import models
from django.contrib.postgres.fields import JSONField
import requests

from core.models import WorkDay
from gamification.models import PingHistory
from gamification.utils import xp_needed_for_level_up, hp_max_with_level


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

    def handle_pinghistory_saved(self, ping_history: PingHistory):
        du = ping_history.pinged.django_user
        slack_username = (
            f"<@{self.users[du.id]}>" if du.id in self.users else du.username
        )
        message = (
            f"{slack_username}: You have not planned your teamtasks"
            "today. Hurry up or you'll lose HP ! 😱😱😱"
        )
        data = {
            "text": message,
            "username": "Teambot by TeamTasks",
            "channel": self.channel,
        }
        try:
            requests.post(self.url, json=data)
        except requests.exceptions.RequestException:
            pass

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
            message = f":clap::clap::clap: {slack_username} finished a workday :clap::clap::clap:"
        elif workday.planned_at:
            message = f":clap::clap::clap: {slack_username} planned a workday :clap::clap::clap:"
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
                        {
                            "title": "Level",
                            "value": f"{userlevel.level} "
                            f"({userlevel.xp}/{xp_needed_for_level_up(userlevel.level)} :eight_pointed_black_star:) "
                            f"({userlevel.hp}/{hp_max_with_level(userlevel.level)} :heart_decoration:)",
                            "short": False,
                        },
                        {
                            "title": "Tasks",
                            "value": "\n".join(
                                [
                                    f"{':spiral_note_pad:' if not workday.validated_at else (':ok_hand:' if task.done else ':skull_and_crossbones:')} {task.label}"
                                    for task in workday.task_set.all()
                                ]
                            ),
                            "short": False,
                        },
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
