from datetime import datetime, date
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient
from unittest import TestCase

from core.models import User
from gamification.utils import xp_needed_for_level_up


class GamificationTestCase(TestCase):
    client = APIClient()

    def test01_utils(self):
        self.assertEqual(xp_needed_for_level_up(1), 10)
        self.assertEqual(xp_needed_for_level_up(2), 15)
        self.assertEqual(xp_needed_for_level_up(3), 20)
        self.assertEqual(xp_needed_for_level_up(4), 25)
        self.assertEqual(xp_needed_for_level_up(5), 30)
        self.assertEqual(xp_needed_for_level_up(6), 40)
        self.assertEqual(xp_needed_for_level_up(7), 50)
        self.assertEqual(xp_needed_for_level_up(8), 60)

    def test02_create_login(self):
        response = GamificationTestCase.client.post(
            "/api/users/register/",
            data={
                "username": "game_01",
                "email": "game_01@test.com",
                "password": "password01",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = GamificationTestCase.client.post(
            "/api/users/login/", data={"username": "game_01", "password": "password01"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = GamificationTestCase.client.post(
            "/api/teams/", data={"team_name": "game_01"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test03_api(self):
        response = GamificationTestCase.client.get("/gamification/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertEqual(len(response_data["notifications"]), 0)
        self.assertEqual(response_data["user_level"]["level"], 1)
        self.assertEqual(response_data["user_level"]["hp"], 20)
        self.assertEqual(response_data["user_level"]["hp_max"], 20)
        self.assertEqual(response_data["user_level"]["xp"], 0)
        self.assertEqual(response_data["user_level"]["xp_required"], 10)

    def test04_working_and_validating_hours(self):
        user = User.objects.get(django_user__username="game_01")

        # 01/01 09:00: Create a workday for 01/01
        workday = user.create_workday(date(2018, 1, 1))
        # 01/01 09:00: Validate it
        workday.validate_planning(timezone.make_aware(datetime(2018, 1, 1, 9, 0, 0)))
        user_level = GamificationTestCase.client.get("/gamification/").json()[
            "user_level"
        ]
        self.assertEqual(user_level["level"], 2)
        self.assertEqual(user_level["hp"], 22)
        self.assertEqual(user_level["hp_max"], 22)
        self.assertEqual(user_level["xp"], 0)
        self.assertEqual(user_level["xp_required"], 15)

        # 01/01 18:00: Finish it
        workday.validate_working(timezone.make_aware(datetime(2018, 1, 1, 18, 0, 0)))
        user_level = GamificationTestCase.client.get("/gamification/").json()[
            "user_level"
        ]
        user.clean_workday()
        self.assertEqual(user_level["level"], 2)
        self.assertEqual(user_level["hp"], 22)
        self.assertEqual(user_level["hp_max"], 22)
        self.assertEqual(user_level["xp"], 10)
        self.assertEqual(user_level["xp_required"], 15)

        # 01/01 18:00: Create a workday for 02/01
        workday = user.create_workday(date(2018, 1, 2))
        # 01/01 18:00: Validate it
        workday.validate_planning(timezone.make_aware(datetime(2018, 1, 1, 18, 0, 0)))
        user_level = GamificationTestCase.client.get("/gamification/").json()[
            "user_level"
        ]
        self.assertEqual(user_level["level"], 3)
        self.assertEqual(user_level["hp"], 24)
        self.assertEqual(user_level["hp_max"], 24)
        self.assertEqual(user_level["xp"], 2)
        self.assertEqual(user_level["xp_required"], 20)

        # 01/03 9:00: Finish it
        workday.validate_working(timezone.make_aware(datetime(2018, 1, 3, 9, 0, 0)))
        user.clean_workday()
        user_level = GamificationTestCase.client.get("/gamification/").json()[
            "user_level"
        ]
        self.assertEqual(user_level["level"], 3)
        self.assertEqual(user_level["hp"], 24)
        self.assertEqual(user_level["hp_max"], 24)
        self.assertEqual(user_level["xp"], 9)
        self.assertEqual(user_level["xp_required"], 20)

        # 01/03 9:00: Create a workday for 04/01
        workday = user.create_workday(date(2018, 1, 4))
        # 01/03 09:00: Validate it
        workday.validate_planning(timezone.make_aware(datetime(2018, 1, 3, 9, 0, 0)))
        user_level = GamificationTestCase.client.get("/gamification/").json()[
            "user_level"
        ]
        self.assertEqual(user_level["level"], 3)
        self.assertEqual(user_level["hp"], 24)
        self.assertEqual(user_level["hp_max"], 24)
        self.assertEqual(user_level["xp"], 9)
        self.assertEqual(user_level["xp_required"], 20)

        # 01/03 9:00: Finish it
        workday.validate_working(timezone.make_aware(datetime(2018, 1, 3, 9, 0, 0)))
        user.clean_workday()
        user_level = GamificationTestCase.client.get("/gamification/").json()[
            "user_level"
        ]
        self.assertEqual(user_level["level"], 3)
        self.assertEqual(user_level["hp"], 24)
        self.assertEqual(user_level["hp_max"], 24)
        self.assertEqual(user_level["xp"], 9)
        self.assertEqual(user_level["xp_required"], 20)

        # 01/04 21:00: Create a workday for 05/01
        workday = user.create_workday(date(2018, 1, 5))
        # 01/04 21:00: Validate it
        workday.validate_planning(timezone.make_aware(datetime(2018, 1, 4, 21, 0, 0)))
        user_level = GamificationTestCase.client.get("/gamification/").json()[
            "user_level"
        ]
        self.assertEqual(user_level["level"], 3)
        self.assertEqual(user_level["hp"], 24)
        self.assertEqual(user_level["hp_max"], 24)
        self.assertEqual(user_level["xp"], 12)
        self.assertEqual(user_level["xp_required"], 20)

        # 01/06 7:00: Finish it
        workday.validate_working(timezone.make_aware(datetime(2018, 1, 6, 7, 0, 0)))
        user.clean_workday()
        user_level = GamificationTestCase.client.get("/gamification/").json()[
            "user_level"
        ]
        self.assertEqual(user_level["level"], 3)
        self.assertEqual(user_level["hp"], 24)
        self.assertEqual(user_level["hp_max"], 24)
        self.assertEqual(user_level["xp"], 15)
        self.assertEqual(user_level["xp_required"], 20)

    def test06_tasks_xp(self):
        user = User.objects.get(django_user__username="game_01")

        workday = user.create_workday(date(2018, 2, 2))
        task1 = user.create_task({"label": "task1", "comments_planning": ""})
        user.create_task({"label": "task2", "comments_planning": ""})
        workday.validate_planning(timezone.make_aware(datetime(2018, 2, 2, 5, 0, 0)))
        user_level = GamificationTestCase.client.get("/gamification/").json()[
            "user_level"
        ]
        self.assertEqual(user_level["level"], 4)
        self.assertEqual(user_level["hp"], 26)
        self.assertEqual(user_level["hp_max"], 26)
        self.assertEqual(user_level["xp"], 0)
        self.assertEqual(user_level["xp_required"], 25)

        task1.done = True
        task1.save()
        user.create_task(
            {"label": "task3", "comments_validation": "", "done": True, "progress": -1}
        )
        workday.validate_working(timezone.make_aware(datetime(2018, 2, 2, 21, 0, 0)))
        user.clean_workday()
        user_level = GamificationTestCase.client.get("/gamification/").json()[
            "user_level"
        ]
        self.assertEqual(user_level["level"], 4)
        self.assertEqual(user_level["hp"], 26)
        self.assertEqual(user_level["hp_max"], 26)
        self.assertEqual(user_level["xp"], 6)
        self.assertEqual(user_level["xp_required"], 25)

    def test07_loose_hp(self):
        user = User.objects.get(django_user__username="game_01")

        workday = user.create_workday(date(2018, 3, 1))
        workday.validate_planning(timezone.make_aware(datetime(2018, 3, 1, 13, 1, 1)))
        user_level = GamificationTestCase.client.get("/gamification/").json()[
            "user_level"
        ]
        self.assertEqual(user_level["level"], 4)
        self.assertEqual(user_level["hp"], 23)
        self.assertEqual(user_level["hp_max"], 26)
        self.assertEqual(user_level["xp"], 6)
        self.assertEqual(user_level["xp_required"], 25)

        workday.validate_working(timezone.make_aware(datetime(2018, 3, 2, 15, 1, 1)))
        user.clean_workday()
        user_level = GamificationTestCase.client.get("/gamification/").json()[
            "user_level"
        ]
        self.assertEqual(user_level["level"], 4)
        self.assertEqual(user_level["hp"], 18)
        self.assertEqual(user_level["hp_max"], 26)
        self.assertEqual(user_level["xp"], 6)
        self.assertEqual(user_level["xp_required"], 25)

        workday = user.create_workday(date(2018, 3, 2))
        workday.validate_planning(timezone.make_aware(datetime(2018, 3, 5, 13, 1, 1)))
        user_level = GamificationTestCase.client.get("/gamification/").json()[
            "user_level"
        ]
        self.assertEqual(user_level["level"], 4)
        self.assertEqual(user_level["hp"], 8)
        self.assertEqual(user_level["hp_max"], 26)
        self.assertEqual(user_level["xp"], 6)
        self.assertEqual(user_level["xp_required"], 25)

        workday.validate_working(timezone.make_aware(datetime(2018, 3, 5, 15, 1, 1)))
        user.clean_workday()
        user_level = GamificationTestCase.client.get("/gamification/").json()[
            "user_level"
        ]
        self.assertEqual(user_level["level"], 4)
        self.assertEqual(user_level["hp"], 26)
        self.assertEqual(user_level["hp_max"], 26)
        self.assertEqual(user_level["xp"], 0)
        self.assertEqual(user_level["xp_required"], 25)

    def test08_last_seen(self):
        client = GamificationTestCase.client
        notifications = client.get("/gamification/").json()["notifications"]
        last_seen = notifications[3]["created_at"].replace("T", " ")[0:-6]
        self.assertEqual(len([n for n in notifications if not n["read"]]), 10)
        notifications = client.get(f"/gamification/?last_seen={last_seen}").json()[
            "notifications"
        ]
        self.assertEqual(len([n for n in notifications if not n["read"]]), 3)
