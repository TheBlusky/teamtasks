from django.db.models.signals import post_save
from django.dispatch import receiver

from core.models import Team, WorkDay
from slack.models import TeamSlack


# post_save because, we need to know if it's created
@receiver(post_save, sender=Team)
def create_user_profile(instance, created, **kwargs):
    if created:
        TeamSlack.initialize_slack(instance)


# pre_save because we need to look up for old data, before update
@receiver(post_save, sender=WorkDay)
def hook_workday_save_event(instance, **kwargs):
    team_slack = instance.user.team.team_slack
    team_slack.handle_workday_saved(instance)
