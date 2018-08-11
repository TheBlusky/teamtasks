from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from api.serializers.workday import CreateSerializer, WorkdaySerializer
from api.utils import IsTeamTasksMember
from core.models import WorkDay, User


class WorkDayViewSet(viewsets.ViewSet):
    permission_classes = (IsTeamTasksMember,)

    def create(self, request):
        serialized = CreateSerializer(data=request.data)
        serialized.is_valid(raise_exception=True)
        user = User.objects.get(django_user=request.user)
        workday = user.create_workday(serialized.validated_data["day"])
        return Response({"status": "ok", "data": WorkdaySerializer(workday).data})

    def list(self, request):
        user = User.objects.get(django_user=request.user)
        searched_user = request.GET.get("user", default=False)
        workdays = WorkDay.objects.filter(user__team_id=user.team_id)
        if searched_user:
            workdays = workdays.filter(user_id=searched_user)
        searched_days = request.GET.get("days", default=False)
        if searched_days:
            workdays = workdays.filter(day__in=searched_days.split("_"))
        workdays = workdays.order_by("-day")
        paginator = Paginator(workdays, 10)
        try:
            workdays = paginator.page(request.GET.get("page", default=1))
        except PageNotAnInteger:
            raise NotFound()
        except EmptyPage:
            raise NotFound()
        return Response(
            {
                "status": "ok",
                "nb_page": paginator.num_pages,
                "data": WorkdaySerializer(workdays, many=True).data,
            }
        )

    @action(methods=["get"], detail=False)
    def current(self, request):
        user = User.objects.get(django_user=request.user)
        if not user.current_workday:
            raise NotFound()
        return Response(
            {"status": "ok", "data": WorkdaySerializer(user.current_workday).data}
        )

    @action(methods=["post"], detail=False)
    def validate_planning(self, request):
        user = User.objects.get(django_user=request.user)
        workday = user.current_workday
        if not workday:
            raise NotFound()
        workday.validate_planning()
        return Response({"status": "ok", "data": WorkdaySerializer(workday).data})

    @action(methods=["post"], detail=False)
    def validate_working(self, request):
        user = User.objects.get(django_user=request.user)
        workday = user.current_workday
        if not workday:
            raise NotFound()
        workday.validate_working()
        user.clean_workday()
        return Response({"status": "ok", "data": WorkdaySerializer(workday).data})
