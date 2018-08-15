from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.urls import logout

from api.serializers.user import RegisterSerializer, LoginSerializer, TeammateSerializer
from api.utils import IsTeamTasksUser, IsTeamTasksMember
from core.exceptions import RegistrationNotAllowed
from core.models import User
from teamtasks import configuration


class UserViewSet(viewsets.ViewSet):
    permission_classes = (IsTeamTasksMember,)

    @action(methods=["post"], detail=False, permission_classes=[])
    def register(self, request):
        if not configuration.ALLOW_REGISTER or configuration.LDAP_ENABLED:
            raise RegistrationNotAllowed()
        serialized = RegisterSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)
        User.create_user(
            username=serialized.validated_data["username"],
            email=serialized.validated_data["email"],
            password=serialized.validated_data["password"],
        )
        return Response({"status": "ok"})

    @action(methods=["post"], detail=False, permission_classes=[])
    def login(self, request):
        serialized = LoginSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)
        user = User.login_user(
            serialized.validated_data["username"],
            serialized.validated_data["password"],
            request,
        )
        return Response(
            {
                "status": "ok",
                "username": user.django_user.username,
                "team_name": user.team.name if user.team else None,
            }
        )

    @action(methods=["get"], detail=False, permission_classes=[])
    def status(self, request):
        can_register = configuration.ALLOW_REGISTER or not configuration.LDAP_ENABLED
        if (
            not request.user
            or not request.user.is_authenticated
            or not User.objects.filter(django_user=request.user).exists()
        ):
            return Response(
                {"status": "ok", "level": "Anonymous", "can_register": can_register}
            )
        user = User.objects.get(django_user=request.user)
        username = user.django_user.username
        team_name = user.team.name if user.team else None
        if not user.team:
            return Response(
                {
                    "status": "ok",
                    "level": "User",
                    "username": username,
                    "team_name": team_name,
                    "can_register": can_register,
                }
            )
        if not user.is_admin:
            return Response(
                {
                    "status": "ok",
                    "level": "Member",
                    "username": username,
                    "team_name": team_name,
                    "can_register": can_register,
                }
            )
        return Response(
            {
                "status": "ok",
                "level": "Admin",
                "username": username,
                "team_name": team_name,
                "can_register": can_register,
            }
        )

    @action(methods=["post"], detail=False, permission_classes=[IsTeamTasksUser])
    def logout(self, request):
        logout(request)
        return Response({"status": "ok"})

    def list(self, request):
        user = User.objects.get(django_user=request.user)
        teammates = User.objects.filter(team_id=user.team_id)
        serializer = TeammateSerializer(teammates, many=True)
        return Response({"status": "ok", "data": serializer.data})
