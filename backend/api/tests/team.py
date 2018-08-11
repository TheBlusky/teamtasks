from rest_framework import status
from rest_framework.test import APIClient
from unittest import TestCase


class ApiTeamTestCase(TestCase):
    def test01_create(self):
        client = APIClient()
        response = client.post(
            "/api/users/register/",
            data={
                "username": "team01",
                "email": "team01@test.com",
                "password": "password01",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "ok")
        response = client.post(
            "/api/users/login/", data={"username": "team01", "password": "password01"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "ok")

        response = client.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "User")

        response = client.post("/api/teams/", data={"team_name": "team01"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "ok")

        response = client.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "Admin")

        response = client.post("/api/teams/", data={"team_name": "team02"})
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

        response = client.get("/api/teams/members/")
        self.assertEqual(len(response.json()["data"]), 1)

        response = client.get("/api/users/")
        self.assertEqual(len(response.json()["data"]), 1)

    def test02_join(self):
        client1 = APIClient()
        response = client1.post(
            "/api/users/login/", data={"username": "team01", "password": "password01"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        client2 = APIClient()
        response = client2.post(
            "/api/users/register/",
            data={
                "username": "team02",
                "email": "team02@test.com",
                "password": "password01",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["status"], "ok")
        response = client2.post(
            "/api/users/login/", data={"username": "team02", "password": "password01"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client1.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "Admin")
        response = client2.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "User")

        response = client2.post("/api/teams/add_user/", data={"username": "team02"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = client1.post("/api/teams/add_user/", data={"username": "team02"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client1.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "Admin")
        response = client2.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "Member")

        response = client1.get("/api/teams/members/")
        self.assertEqual(len(response.json()["data"]), 2)
        response = client2.get("/api/teams/members/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = client1.get("/api/users/")
        self.assertEqual(len(response.json()["data"]), 2)
        response = client2.get("/api/users/")
        self.assertEqual(len(response.json()["data"]), 2)

    def test03_leave(self):
        client1 = APIClient()
        client1.post(
            "/api/users/login/", data={"username": "team01", "password": "password01"}
        )
        client3 = APIClient()
        client3.post(
            "/api/users/register/",
            data={
                "username": "team03",
                "email": "team03@test.com",
                "password": "password01",
            },
        )
        client3.post(
            "/api/users/login/", data={"username": "team03", "password": "password01"}
        )
        response = client1.post("/api/teams/add_user/", data={"username": "team03"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = client1.get("/api/users/")
        self.assertEqual(len(response.json()["data"]), 3)
        response = client3.get("/api/users/")
        self.assertEqual(len(response.json()["data"]), 3)

        response = client1.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "Admin")
        response = client3.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "Member")

        response = client3.post("/api/teams/remove_user/", data={"username": "team03"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = client1.post("/api/teams/remove_user/", data={"username": "team03"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = client1.post("/api/teams/remove_user/", data={"username": "team03"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = client1.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "Admin")
        response = client3.get("/api/users/status/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()["level"], "User")

    def test04_another_team(self):
        clientb1 = APIClient()
        clientb1.post(
            "/api/users/register/",
            data={
                "username": "teamb01",
                "email": "team03@test.com",
                "password": "password01",
            },
        )
        clientb1.post(
            "/api/users/login/", data={"username": "teamb01", "password": "password01"}
        )
        clientb2 = APIClient()
        clientb2.post(
            "/api/users/register/",
            data={
                "username": "teamb02",
                "email": "team03@test.com",
                "password": "password01",
            },
        )
        clientb2.post(
            "/api/users/login/", data={"username": "teamb02", "password": "password01"}
        )
        clientb3 = APIClient()
        clientb3.post(
            "/api/users/register/",
            data={
                "username": "teamb03",
                "email": "team03@test.com",
                "password": "password01",
            },
        )
        clientb3.post(
            "/api/users/login/", data={"username": "teamb03", "password": "password01"}
        )

        response = clientb1.post("/api/teams/", data={"team_name": "team01b"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = clientb1.post("/api/teams/add_user/", data={"username": "teamb02"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = clientb1.post("/api/teams/add_user/", data={"username": "teamb03"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = clientb1.post("/api/teams/add_user/", data={"username": "team01"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        response = clientb1.post("/api/teams/add_user/", data={"username": "team02"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        response = clientb1.post("/api/teams/add_user/", data={"username": "team03"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = clientb3.get("/api/users/")
        self.assertEqual(len(response.json()["data"]), 4)

        client1 = APIClient()
        client1.post(
            "/api/users/login/", data={"username": "team01", "password": "password01"}
        )
        response = client1.get("/api/users/")
        self.assertEqual(len(response.json()["data"]), 2)
