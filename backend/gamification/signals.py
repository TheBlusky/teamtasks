from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from core.models import User, WorkDay
from gamification.models import UserLevel, PingHistory


# post_save because, we need to know if it's created
@receiver(post_save, sender=User)
def create_user_profile(instance, created, **kwargs):
    if created:
        UserLevel.initialize_level(instance)


# pre_save because we need to look up for old data, before update
@receiver(pre_save, sender=WorkDay)
def hook_workday_save_event(instance, **kwargs):
    try:
        old_instance = WorkDay.objects.get(id=instance.id)
        if instance.planned_at is not None and old_instance.planned_at is None:
            instance.user.user_level.handle_workday_planification(instance)
        if instance.validated_at is not None and old_instance.validated_at is None:
            instance.user.user_level.handle_workday_validation(instance)
    except WorkDay.DoesNotExist:
        pass


# pre_save because we need to look up for old data, before update
@receiver(pre_save, sender=WorkDay)
def hook_ping_event(instance, **kwargs):
    try:
        old_instance = WorkDay.objects.get(id=instance.id)
        if instance.planned_at is not None and old_instance.planned_at is None:
            # Workday has just been planned
            ping_user = PingHistory.objects.get(
                pinged=old_instance.user, day=old_instance.day
            )
            ping_user.reward()
    except WorkDay.DoesNotExist:
        pass
    except PingHistory.DoesNotExist:
        pass
