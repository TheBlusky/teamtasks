import time

from rest_framework import status
from rest_framework.test import APIClient
from unittest import TestCase
from teamtasks import configuration


class ApiLdapTestCase(TestCase):
    def setUp(self):
        configuration.LDAP_ENABLED = True
        configuration.LDAP_SERVER = "ldap://ldap:389"
        configuration.LDAP_DN_TEMPLATE = "cn={login},ou=user,dc=teamtasks,dc=fake"
        configuration.LDAP_EMAIL_FIELD = "mail"
        configuration.LDAP_USERNAME_FIELD = "cn"

    def tearDown(self):
        configuration.LDAP_ENABLED = False

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
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test02_login_does_not_exists(self):
        client = APIClient()
        response = client.post(
            "/api/users/login/", data={"username": "nouser", "password": "nopassword"}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test03_login_exist(self):
        client = APIClient()
        response = client.post(
            "/api/users/login/", data={"username": "user1", "password": "nopassword"}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        client = APIClient()
        response = client.post(
            "/api/users/login/",
            data={"username": "user1", "password": "user1_password"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test04_user_already_exist(self):
        client = APIClient()
        response = client.post(
            "/api/users/login/", data={"username": "user1", "password": "nopassword"}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        client = APIClient()
        response = client.post(
            "/api/users/login/",
            data={"username": "user1", "password": "user1_password"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test05_another_login_exist(self):
        client = APIClient()
        response = client.post(
            "/api/users/login/", data={"username": "user2", "password": "nopassword"}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        client = APIClient()
        response = client.post(
            "/api/users/login/",
            data={"username": "user2", "password": "user2_password"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test06_another_user_already_exist(self):
        client = APIClient()
        response = client.post(
            "/api/users/login/", data={"username": "user2", "password": "nopassword"}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        client = APIClient()
        response = client.post(
            "/api/users/login/",
            data={"username": "user2", "password": "user2_password"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
