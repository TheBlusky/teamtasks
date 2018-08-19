from django.urls import path, include
from api.urls import router as api_router
from gamification.urls import urls as gamification_urls

urlpatterns = [
    path(r"api/", include(api_router.urls)),
    path(r"gamification/", include(gamification_urls)),
]
