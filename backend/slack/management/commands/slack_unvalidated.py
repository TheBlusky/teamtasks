import requests
from django.core.management.base import BaseCommand
from datetime import date

from core.models import WorkDay
from slack.models import TeamSlack


class Command(BaseCommand):
    help = "Handle unplanned workdays"

    def handle(self, *args, **options):
        self.stdout.write("- Handling unvalidated workdays")
        for team_slack in TeamSlack.objects.filter(activated=True):
            self.stdout.write(f"  + Teams {team_slack.team_id}")
            users_notify = []
            slack_users = team_slack.users
            for workday in WorkDay.objects.filter(
                day=date.today(),
                validated_at=None,
                user__in=team_slack.team.user_set.all(),
            ).exclude(planned_at=None):
                user_id = str(workday.user_id)
                users_notify.append(
                    f"<@{slack_users[user_id]}>"
                    if user_id in slack_users
                    else workday.user.django_user.username
                )
            if len(users_notify) > 0:
                message = (
                    f"{', '.join(users_notify)}: You have a planned workday "
                    "for today but did not validate it yet. Hurry up or "
                    "you'll lose HP ! 😱😱😱}"
                )
                data = {
                    "text": message,
                    "username": "Teambot by TeamTasks",
                    "channel": team_slack.channel,
                }
                try:
                    requests.post(team_slack.url, json=data)
                except requests.exceptions.RequestException:
                    self.stdout.write(self.style.ERROR("Error during request"))
                self.stdout.write(f"Sent: {message}")
            else:
                self.stdout.write("Nothing to send")
        self.stdout.write(self.style.SUCCESS("Success"))
