from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from api.serializers.task import (
    TaskSerializer,
    SuggestionSerializer,
    WorkingUnplannedTaskSerializer,
    PlanningTaskSerializer,
    WorkingPlannedTaskSerializer,
)
from api.utils import IsTeamTasksMember
from core.exceptions import (
    NoCurrentWorkDay,
    WorkDayAlreadyFinished,
    NotInCurrentWorkday,
)
from core.models import User, Task


class TaskViewSet(viewsets.ViewSet):
    permission_classes = (IsTeamTasksMember,)

    def create(self, request):
        user = User.objects.get(django_user=request.user)
        workday = user.current_workday
        if not workday:
            # No current workday
            raise NoCurrentWorkDay()
        if workday.validated_at:
            # Workday is already validated, should not happen
            raise WorkDayAlreadyFinished()  # pragma: no cover
        serialized = (
            WorkingUnplannedTaskSerializer
            if workday.planned_at
            else PlanningTaskSerializer
        )(data=request.data)
        serialized.is_valid(raise_exception=True)
        task = user.create_task(serialized.validated_data)
        return Response({"status": "ok", "data": TaskSerializer(task).data})

    def update(self, request, pk=None):
        user = User.objects.get(django_user=request.user)
        workday = user.current_workday
        task = get_object_or_404(Task, id=pk, user=user)
        if workday is None or workday.id != task.workday_id:
            # Not in current workday
            raise NotInCurrentWorkday()
        # You can take a minute to get this one
        serialized = (
            (
                WorkingPlannedTaskSerializer
                if task.planned
                else WorkingUnplannedTaskSerializer
            )
            if workday.planned_at
            else PlanningTaskSerializer
        )(data=request.data)
        serialized.is_valid(raise_exception=True)
        user.update_task(task, serialized.validated_data)
        return Response({"status": "ok", "data": TaskSerializer(task).data})

    @action(methods=["get"], detail=False)
    def suggestions(self, request):
        user = User.objects.get(django_user=request.user)
        tasks = Task.objects.filter(user=user, suggest=True, done=False).exclude(
            workday=user.current_workday
        )
        return Response(
            {"status": "ok", "data": SuggestionSerializer(tasks, many=True).data}
        )

    @action(methods=["post"], detail=True)
    def remove_suggestion(self, request, pk=None):
        user = User.objects.get(django_user=request.user)
        task = get_object_or_404(Task, id=pk, user=user)
        task.suggest = False
        task.save()
        return Response({"status": "ok"})
