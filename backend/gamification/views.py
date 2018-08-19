from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from api.utils import IsTeamTasksMember
from core.models import User
from gamification.serializers import UserLevelSerializer, Notification


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
