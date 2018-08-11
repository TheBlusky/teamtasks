import uuid
from django.db import models, IntegrityError
from django.utils import timezone
import django.contrib.auth

from core.utils import ldap_authenticate
from core import exceptions
from core.exceptions import (
    AlreadyWorking,
    AlreadyPlanned,
    NotPlannedYet,
    AlreadyWorked,
    DayAlreadyExists,
)
from teamtasks import configuration


class Team(models.Model):
    name = models.CharField(max_length=32)
    slack_url = models.CharField(max_length=128, default="")
    slack_channel_public = models.CharField(max_length=128, default="")

    @classmethod
    def create_team(cls, team_name):
        team = Team()
        team.name = team_name
        team.save()
        return team

    def add_user(self, new_user):
        new_user.team = self
        new_user.save()

    def remove_user(self, old_user):
        old_user.team = None
        old_user.save()


class User(models.Model):
    django_user = models.ForeignKey(
        "auth.User", on_delete=models.CASCADE, related_name="teamtasks_user"
    )
    current_workday = models.ForeignKey(
        "WorkDay",
        on_delete=models.CASCADE,
        related_name="+",
        blank=True,
        default=None,
        null=True,
    )
    team = models.ForeignKey(
        "Team", on_delete=models.CASCADE, blank=True, default=None, null=True
    )
    slack_name = models.CharField(max_length=32, default="")
    is_admin = models.BooleanField(default=False)
    level = models.IntegerField(default=1)
    xp = models.IntegerField(default=0)
    hp = models.IntegerField(default=5)

    @classmethod
    def create_user(cls, username, email, password):
        try:
            django_user = django.contrib.auth.models.User.objects.create_user(
                username, email, password
            )
        except IntegrityError:
            raise exceptions.UserAlreadyExists()
        user = User()
        user.django_user = django_user
        user.save()
        return user

    @classmethod
    def login_user(cls, username, password, request):
        if configuration.LDAP_ENABLED:
            user_model = django.contrib.auth.get_user_model()
            try:
                ldap_info = ldap_authenticate(username, password)
                django_user = user_model.objects.get(username=username)
            except user_model.DoesNotExist:
                user = User.create_user(
                    ldap_info["username"], ldap_info["email"], str(uuid.uuid4())
                )
                django_user = user.django_user
        else:
            django_user = django.contrib.auth.authenticate(
                request, username=username, password=password
            )
        if django_user is not None:
            django.contrib.auth.login(request, django_user)
        else:
            raise exceptions.AuthenticationFailed()
        return django_user.teamtasks_user.first()

    def create_team(self, team_name):
        team = Team.create_team(team_name)
        self.team = team
        self.is_admin = True
        self.save()

    def create_workday(self, day):
        if self.current_workday:
            raise AlreadyWorking()
        workday = WorkDay.create_workday(self, day)
        self.current_workday = workday
        self.save()
        return workday

    def clean_workday(self):
        self.current_workday = None
        self.save()

    def create_task(self, data):
        return Task.create_task(self, self.current_workday, data)

    def update_task(self, task, data):
        return task.update_task(data)


class WorkDay(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    day = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    planned_at = models.DateTimeField(null=True, default=None)
    validated_at = models.DateTimeField(null=True, default=None)

    class Meta:
        ordering = ["-id"]

    @classmethod
    def create_workday(cls, user, day):
        if WorkDay.objects.filter(user=user, day=day).count() > 0:
            raise DayAlreadyExists()
        # Todo: only create today or tomorrow
        workday = WorkDay()
        workday.user = user
        workday.day = day
        workday.save()
        return workday

    def validate_planning(self):
        if self.planned_at:
            raise AlreadyPlanned()

        self.planned_at = timezone.now()
        self.save()

    def validate_working(self):
        if not self.planned_at:
            raise NotPlannedYet()
        if self.validated_at:
            raise AlreadyWorked()  # pragma: no cover
        self.validated_at = timezone.now()
        self.save()


class Task(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    workday = models.ForeignKey("WorkDay", on_delete=models.CASCADE)
    label = models.CharField(max_length=32)
    comments_planning = models.TextField(blank=True, default="")
    comments_validation = models.TextField(blank=True, default="")
    done = models.BooleanField(default=False)
    planned = models.BooleanField()
    progress = models.IntegerField(default=-1)
    suggest = models.BooleanField(default=True)

    class Meta:
        ordering = ["id"]

    @classmethod
    def create_task(cls, user, workday, data):
        task = Task()
        task.user = user
        task.workday = workday
        task.planned = not workday.planned_at
        task.label = data["label"]
        if task.planned:
            task.comments_planning = data["comments_planning"]
        else:
            task.comments_validation = data["comments_validation"]
            task.progress = data["progress"]
            task.done = data["done"]
        task.save()
        return task

    def update_task(self, data):
        if self.workday.planned_at:
            if not self.planned:
                self.label = data["label"]
            self.comments_validation = data["comments_validation"]
            self.progress = data["progress"]
            self.done = data["done"]
        else:
            self.label = data["label"]
            self.comments_planning = data["comments_planning"]
        self.save()
        return self
