from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from api.serializers.team import CreateSerializer, UserSerializer, TeammateSerializer
from api.utils import IsTeamTasksUser, IsTeamTasksAdmin
from core.exceptions import AlreadyInTeam
from core.models import User


class TeamViewSet(viewsets.ViewSet):
    permission_classes = (IsTeamTasksUser,)

    def create(self, request):
        serialized = CreateSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)
        user = User.objects.get(django_user=request.user)
        if user.team:
            raise AlreadyInTeam()
        user.create_team(serialized.validated_data["team_name"])
        return Response({"status": "ok"})

    @action(methods=["post"], detail=False, permission_classes=[IsTeamTasksAdmin])
    def add_user(self, request):
        serialized = UserSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)
        current_user = User.objects.get(django_user=request.user)
        new_user = get_object_or_404(
            User, django_user__username=serialized.validated_data["username"], team=None
        )
        current_user.team.add_user(new_user)
        return Response({"status": "ok"})

    @action(methods=["post"], detail=False, permission_classes=[IsTeamTasksAdmin])
    def remove_user(self, request):
        serialized = UserSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)
        current_user = User.objects.get(django_user=request.user)
        old_user = get_object_or_404(
            User,
            django_user__username=serialized.validated_data["username"],
            team=current_user.team,
        )
        current_user.team.remove_user(old_user)
        return Response({"status": "ok"})

    @action(methods=["get"], detail=False, permission_classes=[IsTeamTasksAdmin])
    def members(self, request):
        user = User.objects.get(django_user=request.user)
        teammates = User.objects.filter(team_id=user.team_id)
        serializer = TeammateSerializer(teammates, many=True)
        return Response({"status": "ok", "data": serializer.data})
