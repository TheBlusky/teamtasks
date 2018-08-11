from rest_framework import routers

from api.views.task import TaskViewSet
from api.views.team import TeamViewSet
from api.views.user import UserViewSet
from api.views.workday import WorkDayViewSet

router = routers.SimpleRouter()
router.register(r"users", UserViewSet, base_name="api_user")
router.register(r"teams", TeamViewSet, base_name="api_team")
router.register(r"workdays", WorkDayViewSet, base_name="api_workday")
router.register(r"tasks", TaskViewSet, base_name="api_task")
