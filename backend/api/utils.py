from rest_framework import permissions

from core.models import User


class IsTeamTasksUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and User.objects.filter(django_user=request.user).exists()
        )


class IsTeamTasksAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and User.objects.filter(django_user=request.user).exists()
            and User.objects.get(django_user=request.user).team
            and User.objects.get(django_user=request.user).is_admin
        )


class IsTeamTasksMember(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and User.objects.filter(django_user=request.user).exists()
            and User.objects.get(django_user=request.user).team
        )
