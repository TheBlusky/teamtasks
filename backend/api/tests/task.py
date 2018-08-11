import datetime

from rest_framework import status
from rest_framework.test import APIClient
from unittest import TestCase


class ApiTaskTestCase(TestCase):
    def test01_create(self):
        client = APIClient()
        client.post(
            "/api/users/register/",
            data={
                "username": "task01",
                "email": "task01@test.com",
                "password": "password01",
            },
        )
        client.post(
            "/api/users/login/", data={"username": "task01", "password": "password01"}
        )
        response = client.post("/api/teams/", data={"team_name": "workday01"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "ok")

        response = client.get("/api/workdays/current/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = client.post("/api/tasks/", data={})
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

        response = client.post(
            "/api/workdays/", data={"day": str(datetime.date.today())}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.get("/api/workdays/current/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()["data"]["task_set"]), 0)

        # Creating first task
        response = client.post(
            "/api/tasks/",
            data={"label": "label task 1", "comments_planning": "comment task1"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        task_1_id = response.json()["data"]["id"]

        # Checking we can get it
        response = client.get("/api/workdays/current/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()["data"]["task_set"]), 1)
        self.assertEqual(response.json()["data"]["task_set"][0]["id"], task_1_id)
        self.assertEqual(
            response.json()["data"]["task_set"][0]["label"], "label task 1"
        )
        self.assertEqual(
            response.json()["data"]["task_set"][0]["comments_planning"], "comment task1"
        )

        # Modifying it
        response = client.put(
            f"/api/tasks/{task_1_id}/",
            data={"label": "label task 1b", "comments_planning": "comment task1b"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["data"]["id"], task_1_id)

        # Checking modifications
        response = client.get("/api/workdays/current/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()["data"]["task_set"]), 1)
        self.assertEqual(response.json()["data"]["task_set"][0]["id"], task_1_id)
        self.assertEqual(response.json()["data"]["task_set"][0]["planned"], True)
        self.assertEqual(
            response.json()["data"]["task_set"][0]["label"], "label task 1b"
        )
        self.assertEqual(
            response.json()["data"]["task_set"][0]["comments_planning"],
            "comment task1b",
        )

        # Planning workday
        response = client.post("/api/workdays/validate_planning/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Cannot modify comments_planning
        response = client.put(
            f"/api/tasks/{task_1_id}/",
            data={"label": "label task 1c", "comments_planning": "comment task1c"},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Can modify all other values
        response = client.put(
            f"/api/tasks/{task_1_id}/",
            data={
                "comments_validation": "comment val task1c",
                "done": False,
                "progress": 18,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Checking modifications
        response = client.get("/api/workdays/current/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()["data"]["task_set"]), 1)
        self.assertEqual(response.json()["data"]["task_set"][0]["id"], task_1_id)
        self.assertEqual(
            response.json()["data"]["task_set"][0]["label"], "label task 1b"
        )
        self.assertEqual(
            response.json()["data"]["task_set"][0]["comments_planning"],
            "comment task1b",
        )
        self.assertEqual(
            response.json()["data"]["task_set"][0]["comments_validation"],
            "comment val task1c",
        )
        self.assertEqual(response.json()["data"]["task_set"][0]["done"], False)
        self.assertEqual(response.json()["data"]["task_set"][0]["planned"], True)
        self.assertEqual(response.json()["data"]["task_set"][0]["progress"], 18)

        # Adding a post planning task
        response = client.post(
            "/api/tasks/",
            data={
                "label": "label task 2",
                "comments_validation": "comment val task2",
                "done": True,
                "progress": 5,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        task_2_id = response.json()["data"]["id"]

        # Checking currents
        response = client.get("/api/workdays/current/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        tasks = response.json()["data"]["task_set"]
        self.assertEqual(len(tasks), 2)
        task1 = tasks[0] if tasks[0]["id"] == task_1_id else tasks[1]
        task2 = tasks[0] if tasks[0]["id"] == task_2_id else tasks[1]
        self.assertEqual(task1["id"], 1)
        self.assertEqual(task1["label"], "label task 1b")
        self.assertEqual(task1["comments_planning"], "comment task1b")
        self.assertEqual(task1["comments_validation"], "comment val task1c")
        self.assertEqual(task1["done"], False)
        self.assertEqual(task1["planned"], True)
        self.assertEqual(task1["progress"], 18)
        self.assertEqual(task2["id"], 2)
        self.assertEqual(task2["label"], "label task 2")
        self.assertEqual(task2["comments_planning"], "")
        self.assertEqual(task2["comments_validation"], "comment val task2")
        self.assertEqual(task2["done"], True)
        self.assertEqual(task2["planned"], False)
        self.assertEqual(task2["progress"], 5)

        # Modifying task2
        response = client.put(
            f"/api/tasks/{task_2_id}/",
            data={
                "label": "label task 2b",
                "comments_validation": "comment val task2b",
                "done": True,
                "progress": 51,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Checking modifications
        response = client.get("/api/workdays/current/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        tasks = response.json()["data"]["task_set"]
        task2 = tasks[0] if tasks[0]["id"] == task_2_id else tasks[1]
        self.assertEqual(task2["id"], 2)
        self.assertEqual(task2["label"], "label task 2b")
        self.assertEqual(task2["comments_planning"], "")
        self.assertEqual(task2["comments_validation"], "comment val task2b")
        self.assertEqual(task2["done"], True)
        self.assertEqual(task2["planned"], False)
        self.assertEqual(task2["progress"], 51)

        # Should not have any suggestion
        response = client.get("/api/tasks/suggestions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()["data"]), 0)

        # Validate Workday
        response = client.post("/api/workdays/validate_working/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Current should be empty
        response = client.get("/api/workdays/current/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Should have one suggestion
        response = client.get("/api/tasks/suggestions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()["data"]), 1)

        # Removing it
        response = client.post(f"/api/tasks/{task_1_id}/remove_suggestion/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Should have no suggestion
        response = client.get("/api/tasks/suggestions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.json()["data"]), 0)

        # Should not be able to update preivous tasks
        response = client.put(f"/api/tasks/{task_2_id}/")
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
