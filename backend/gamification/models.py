import requests
from django.utils import timezone
import datetime
from django.db import models
from rest_framework.exceptions import NotFound

from core.exceptions import TooEarly, AlreadyPinged, CantSelfPing
from core.models import WorkDay
from gamification.utils import xp_needed_for_level_up, hp_max_with_level


class UserLevel(models.Model):
    teamtasks_user = models.OneToOneField(
        "core.User", on_delete=models.CASCADE, related_name="user_level"
    )
    level = models.IntegerField(default=1)
    xp = models.IntegerField(default=0)
    hp = models.IntegerField(default=20)

    def add_xp(self, xp, message=""):
        new_xp = self.xp + xp
        self.create_notification("xp", xp, message)
        while new_xp >= xp_needed_for_level_up(self.level):
            self.create_notification("level", 1, "You gain a level")
            new_xp -= xp_needed_for_level_up(self.level)
            self.level += 1
            self.hp = hp_max_with_level(self.level)
        self.xp = new_xp
        self.save()

    def remove_hp(self, hp, message=""):
        new_hp = self.hp - hp
        self.create_notification("hp", -hp, message)
        if new_hp < 0:
            self.hp = hp_max_with_level(self.level)
            self.xp = 0
            self.create_notification("xp", -self.xp, "You died")
        else:
            self.hp = new_hp
        self.save()

    @classmethod
    def initialize_level(cls, teamtasks_user):
        user_level = UserLevel()
        user_level.teamtasks_user = teamtasks_user
        user_level.save()
        return user_level

    def create_notification(self, field, amount, message):
        return Notification.create_notification(self, field, amount, message)

    def handle_workday_planification(self, workday: WorkDay):
        workday_day = timezone.make_aware(
            datetime.datetime.combine(workday.day, datetime.time(0, 0, 0))
        )
        delta_time = workday.planned_at - workday_day
        delta_time_minutes = int(delta_time.total_seconds() / 60)

        # No XP at all if planned too early
        if delta_time_minutes <= -24 * 60 + 17 * 60:
            self.add_xp(
                0, "You planned the workday too early (before 17:00), no XP for you !"
            )
            return

        # Lose HP if too late
        if delta_time_minutes >= 10 * 60:
            lateness = int((delta_time_minutes - 10 * 60) / 60)
            hp_loss = min(lateness, 10)
            if hp_loss > 0:
                self.remove_hp(
                    hp_loss, f"You planned the workday {lateness} hour(s) late."
                )
            return

        # Max XP if planned between 08:00 / 10:00
        if 8 * 60 <= delta_time_minutes <= 10 * 60:
            self.add_xp(10, "You planned this workday on an excellent time")
        # Good XP if planned the day before between 17:00 and 20:00
        elif -24 * 60 + 17 * 60 <= delta_time_minutes <= -24 * 60 + 20 * 60:
            self.add_xp(7, "You planned this workday on an good time")
        # Some XP if planned between 20:00 day before, and 08:00 workday
        elif -24 * 60 + 20 * 60 <= delta_time_minutes <= 8 * 60:
            self.add_xp(
                3,
                "You should not plan your workday outside work hours... still, it's good to plan ahead :-)",
            )
        else:  # pragma: no cover
            self.add_xp(
                0,
                "You did not win any XP, we don't know why, it should not happen. Contact your administrator.",
            )

        nb_tasks = workday.task_set.all().count()
        if nb_tasks > 0:
            self.add_xp(min(nb_tasks, 5), f"You planned {nb_tasks} task(s).")

    def handle_workday_validation(self, workday):
        workday_day = timezone.make_aware(
            datetime.datetime.combine(workday.day, datetime.time(0, 0, 0))
        )
        delta_time = workday.validated_at - workday_day
        delta_time_minutes = int(delta_time.total_seconds() / 60)

        # No XP at all if validated too early
        if delta_time_minutes <= 17 * 60:
            self.add_xp(
                0, "You validated the workday too early (before 17:00), no XP for you !"
            )
            return

        # Lose HP if too late
        if delta_time_minutes >= 24 * 60 + 10 * 60:
            lateness = int((delta_time_minutes - (24 * 60 + 10 * 60)) / 60)
            hp_loss = min(lateness, 10)
            if hp_loss > 0:
                self.remove_hp(
                    hp_loss, f"You validated the workday {lateness} hour(s) late."
                )
            return

        # Max XP if validated the day before between 17:00 and 20:00
        elif 17 * 60 <= delta_time_minutes <= 20 * 60:
            self.add_xp(10, "You validated this workday on an excellent time")
        # Good XP if validated between 08:00 / 10:00
        elif 24 * 60 + 8 * 60 <= delta_time_minutes <= 24 * 60 + 10 * 60:
            self.add_xp(7, "You validated this workday on a good time")
        # Some XP if validated between 20:00 workday, and 08:00 day after
        elif 20 * 60 <= delta_time_minutes <= 24 * 60 + 8 * 60:
            self.add_xp(
                3,
                "You should not validate your workday outside work hours... still, it's good to do it :-)",
            )
        else:  # pragma: no cover
            self.add_xp(
                0,
                "You did not win any XP, we don't know why, it should not happen. Contact your administrator.",
            )

        nb_planned_task_done = workday.task_set.filter(done=True, planned=True).count()
        nb_unplanned_task_done = workday.task_set.filter(
            done=True, planned=False
        ).count()

        xp_for_planned = min(nb_planned_task_done * 2, 10)
        xp_for_unplanned = min(nb_unplanned_task_done, 5)
        xp_for_unplanned = (
            xp_for_unplanned
            if xp_for_unplanned + xp_for_planned <= 10
            else 10 - xp_for_planned
        )

        if xp_for_planned > 0:
            self.add_xp(
                xp_for_planned, f"You achieved {nb_planned_task_done} planned task(s)."
            )

        if xp_for_unplanned > 0:
            self.add_xp(
                xp_for_unplanned,
                f"You achieved {nb_unplanned_task_done} unplanned task(s).",
            )


class Notification(models.Model):
    user_level = models.ForeignKey("gamification.UserLevel", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    field = models.CharField(max_length=8)
    message = models.TextField()
    amount = models.IntegerField()
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    @classmethod
    def create_notification(cls, user_level, field, amount, message):
        notification = Notification()
        notification.user_level = user_level
        notification.field = field
        notification.amount = amount
        notification.message = message
        notification.save()


class PingHistory(models.Model):
    pinger = models.ForeignKey("core.User", on_delete=models.CASCADE, related_name="+")
    pinged = models.ForeignKey("core.User", on_delete=models.CASCADE, related_name="+")
    day = models.DateField(auto_now_add=True)

    @classmethod
    def ping(cls, current_user, pinged_user):
        if current_user.team_id != pinged_user.team_id:
            raise NotFound
        workday = pinged_user.current_workday
        if datetime.datetime.now().hour < 10:
            raise TooEarly
        if current_user.id == pinged_user.id:
            raise CantSelfPing
        if workday is None:
            # No workday, ping is ok !
            pass
        elif workday.day != datetime.date.today():
            # Workday is not today, ping is ok !
            pass
        elif workday.planned_at is None:
            # Workday is not planned yet, ping is ok !
            pass
        elif not PingHistory.objects.filter(
            pinger=current_user, pinged=pinged_user, day=datetime.date.today()
        ).exists():
            # Workday is not pinged yet, ping is ok !
            pass
        else:
            # Workday is already pinged, do not ping
            raise AlreadyPinged
        ping_history = PingHistory()
        ping_history.pinged = pinged_user
        ping_history.pinger = current_user
        ping_history.save()
        return ping_history

    def reward(self):
        user_level = UserLevel.objects.get(teamtasks_user=self.pinger)
        user_level.add_xp(
            5,
            f"{self.pinger.django_user.username} validated a workday you pinged him for",
        )
