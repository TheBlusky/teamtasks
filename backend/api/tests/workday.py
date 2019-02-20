import datetime

from rest_framework import status
from rest_framework.test import APIClient
from unittest import TestCase


class ApiWorkdayTestCase(TestCase):
    def test01_create(self):
        client = APIClient()
        client.post(
            "/api/users/register/",
            data={
                "username": "workday01",
                "email": "workday01@test.com",
                "password": "password01",
            },
        )
        client.post(
            "/api/users/login/",
            data={"username": "workday01", "password": "password01"},
        )
        response = client.post("/api/teams/", data={"team_name": "workday01"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "ok")

        response = client.get("/api/workdays/current/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = client.post(
            "/api/workdays/", data={"day": str(datetime.date.today())}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.get("/api/workdays/current/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.post(
            "/api/workdays/", data={"day": str(datetime.date.today())}
        )
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test02_validations(self):
        client = APIClient()
        client.post(
            "/api/users/login/",
            data={"username": "workday01", "password": "password01"},
        )
        response = client.get("/api/workdays/current/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Workday is just created
        response = client.post("/api/workdays/validate_working/")
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

        response = client.post("/api/workdays/validate_planning/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Workday is planned
        response = client.get("/api/workdays/current/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.post("/api/workdays/validate_planning/")
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

        response = client.post("/api/workdays/validate_working/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Workday is finished
        response = client.get("/api/workdays/current/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = client.post("/api/workdays/validate_working/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = client.post("/api/workdays/validate_planning/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = client.post(
            "/api/workdays/", data={"day": str(datetime.date.today())}
        )
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test03_list(self):
        client = APIClient()
        client.post(
            "/api/users/login/",
            data={"username": "workday01", "password": "password01"},
        )

        response = client.get("/api/workdays/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.get("/api/workdays/?user=1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.get("/api/workdays/?days=2019-02-17")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client.get("/api/workdays/?page=aaa")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = client.get("/api/workdays/?page=999")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
