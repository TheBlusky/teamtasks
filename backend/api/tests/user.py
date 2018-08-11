from rest_framework import status
from rest_framework.test import APIClient
from unittest import TestCase


class ApiUserTestCase(TestCase):
    def test01_create(self):
        client = APIClient()
        response = client.post(
            "/api/users/register/",
            data={
                "username": "test01",
                "email": "test01@test.com",
                "password": "password01",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "ok")

    def test02_cant_recreate(self):
        client = APIClient()
        response = client.post(
            "/api/users/register/",
            data={
                "username": "test02",
                "email": "test02@test.com",
                "password": "password01",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "ok")
        response = client.post(
            "/api/users/register/",
            data={
                "username": "test02",
                "email": "test02other@test.com",
                "password": "password01",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test03_login(self):
        client = APIClient()
        response = client.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "Anonymous")
        response = client.post(
            "/api/users/register/",
            data={
                "username": "test03",
                "email": "test03@test.com",
                "password": "password01",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "ok")
        response = client.post(
            "/api/users/login/",
            data={"username": "test03Wrong", "password": "password01"},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = client.post(
            "/api/users/login/",
            data={"username": "test03", "password": "password01Wrong"},
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = client.post(
            "/api/users/login/", data={"username": "test03", "password": "password01"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "ok")
        self.assertEqual(response.json()["username"], "test03")
        self.assertEqual(response.json()["team_name"], None)
        response = client.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "User")

    def test04_logout(self):
        client = APIClient()
        response = client.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "Anonymous")
        response = client.post(
            "/api/users/register/",
            data={
                "username": "test04",
                "email": "test04@test.com",
                "password": "password01",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "ok")
        response = client.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "Anonymous")
        response = client.post(
            "/api/users/login/", data={"username": "test04", "password": "password01"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "ok")
        response = client.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "User")
        response = client.post("/api/users/logout/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = client.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "Anonymous")
