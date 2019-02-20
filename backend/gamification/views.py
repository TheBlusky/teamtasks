import datetime
from django.db.models import Value
from django.db.models.functions import Concat
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from api.utils import IsTeamTasksMember
from core.models import User, WorkDay
from gamification.models import PingHistory
from gamification.serializers import (
    UserLevelSerializer,
    Notification,
    PingUserSerializer,
)


@api_view(http_method_names=["GET"])
@permission_classes([IsTeamTasksMember])
def get_gamification_status(request):
    user = User.objects.get(django_user=request.user)
    user_level = user.user_level
    last_seen = request.GET.get("last_seen", default=False)
    if last_seen:
        user_level.notification_set.filter(
            read=False, created_at__lte=last_seen
        ).update(read=True)
    notifications = user_level.notification_set.all()[0:10]
    return Response(
        {
            "status": "ok",
            "user_level": UserLevelSerializer(user_level).data,
            "notifications": Notification(notifications, many=True).data,
        }
    )


@api_view(http_method_names=["POST", "GET"])
@permission_classes([IsTeamTasksMember])
def ping_user(request):
    current_user = User.objects.get(django_user=request.user)
    if request.method == "POST":
        serialized = PingUserSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)
        pinged_user = get_object_or_404(
            User, django_user__username=serialized.validated_data["username"]
        )
        PingHistory.ping(current_user, pinged_user)
        return Response({"status": "ok"})
    else:
        pingable = (
            (
                User.objects.filter(team=current_user.team)
                .exclude(id=current_user.id)
                .exclude(
                    id__in=PingHistory.objects.filter(day=datetime.date.today()).values(
                        "pinged"
                    )
                )
                .exclude(
                    id__in=WorkDay.objects.filter(
                        day=datetime.date.today(), planned_at__isnull=False
                    ).values("user")
                )
                .annotate(username=Concat("django_user__username", Value("")))
            )
            if datetime.datetime.now().hour >= 10
            else []
        )
        return Response(
            {"status": "ok", "users": PingUserSerializer(pingable, many=True).data}
        )
