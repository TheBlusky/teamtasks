from rest_framework.decorators import permission_classes, api_view
from rest_framework.response import Response

from api.utils import IsTeamTasksAdmin
from core.models import User
from slack.serializers import TeamSlackSerializer


@api_view(http_method_names=["GET", "POST"])
@permission_classes([IsTeamTasksAdmin])
def slack_view(request):
    team_slack = User.objects.get(django_user=request.user).team.team_slack
    if request.method == "POST":
        serialized = TeamSlackSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)
        team_slack.activated = serialized.validated_data["activated"]
        team_slack.url = serialized.validated_data["url"]
        team_slack.channel = serialized.validated_data["channel"]
        team_slack.users = serialized.validated_data["users"]
        team_slack.save()
    return Response({"status": "ok", "data": TeamSlackSerializer(team_slack).data})
