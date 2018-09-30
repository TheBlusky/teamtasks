import datetime

from rest_framework import status
from rest_framework.test import APIClient
from django.core.management import call_command
from unittest import TestCase

from core.models import User


class SlackTestCase(TestCase):
    client = APIClient()
    client2 = APIClient()

    def test01_create_login(self):
        response = SlackTestCase.client.post(
            "/api/users/register/",
            data={
                "username": "slack_01",
                "email": "slack_01@test.com",
                "password": "password01",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = SlackTestCase.client.post(
            "/api/users/login/", data={"username": "slack_01", "password": "password01"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = SlackTestCase.client.post(
            "/api/teams/", data={"team_name": "slack_01"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = SlackTestCase.client2.post(
            "/api/users/register/",
            data={
                "username": "slack_02",
                "email": "slack_02@test.com",
                "password": "password01",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = SlackTestCase.client2.post(
            "/api/users/login/", data={"username": "slack_02", "password": "password01"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = SlackTestCase.client.post(
            "/api/teams/add_user/", data={"username": "slack_02"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test02_views(self):
        response = SlackTestCase.client.get("/slack/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()["data"]
        self.assertEqual(response_data["activated"], False)
        self.assertEqual(response_data["url"], "")
        self.assertEqual(response_data["channel"], "")
        self.assertEqual(len(response_data["users"]), 0)

        data = {
            "activated": True,
            "url": "localhost",
            "channel": "#none",
            "users": {
                str(User.objects.get(django_user__username="slack_01").id): "toto"
            },
        }
        response = SlackTestCase.client.post("/slack/", data=data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()["data"]
        self.assertEqual(response_data["activated"], True)
        self.assertEqual(response_data["url"], "localhost")
        self.assertEqual(response_data["channel"], "#none")
        self.assertEqual(len(response_data["users"]), 1)

        response = SlackTestCase.client.get("/slack/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()["data"]
        self.assertEqual(response_data["activated"], True)
        self.assertEqual(response_data["url"], "localhost")
        self.assertEqual(response_data["channel"], "#none")
        self.assertEqual(len(response_data["users"]), 1)

    def test03_notifications(self):
        class StdOut:
            def __init__(self):
                self.data = ""

            def reset(self):
                self.data = ""
                return self

            def write(self, data):
                self.data += data

        stdout = StdOut()

        # Nothing to send
        call_command("slack_unplanned", stdout=stdout.reset())
        self.assertTrue("Nothing to send" in stdout.data)
        self.assertFalse("Sent" in stdout.data)
        self.assertFalse("Error" in stdout.data)
        self.assertTrue("Success" in stdout.data)

        call_command("slack_unvalidated", stdout=stdout.reset())
        self.assertTrue("Nothing to send" in stdout.data)
        self.assertFalse("Sent" in stdout.data)
        self.assertFalse("Error" in stdout.data)
        self.assertTrue("Success" in stdout.data)

        # Creating one workday
        response = SlackTestCase.client.post(
            "/api/workdays/", data={"day": str(datetime.date.today())}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Only one notification
        call_command("slack_unplanned", stdout=stdout.reset())
        self.assertFalse("Nothing to send" in stdout.data)
        self.assertTrue("Sent" in stdout.data)
        self.assertTrue("Error during request" in stdout.data)  # No actual slack server
        self.assertTrue("Success" in stdout.data)
        sent_to = (
            [a for a in stdout.data.split("\n") if "Sent" in a][0]
            .split(": ")[1]
            .split(", ")
        )
        self.assertEqual(len(sent_to), 1)
        self.assertEqual(sent_to[0], "<@toto>")

        call_command("slack_unvalidated", stdout=stdout.reset())
        self.assertTrue("Nothing to send" in stdout.data)
        self.assertFalse("Sent" in stdout.data)
        self.assertFalse("Error" in stdout.data)
        self.assertTrue("Success" in stdout.data)

        # Creating another workday
        response = SlackTestCase.client2.post(
            "/api/workdays/", data={"day": str(datetime.date.today())}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Only two notifications
        call_command("slack_unplanned", stdout=stdout.reset())
        self.assertFalse("Nothing to send" in stdout.data)
        self.assertTrue("Sent" in stdout.data)
        self.assertTrue("Error during request" in stdout.data)
        self.assertTrue("Success" in stdout.data)
        sent_to = (
            [a for a in stdout.data.split("\n") if "Sent" in a][0]
            .split(": ")[1]
            .split(", ")
        )
        self.assertEqual(len(sent_to), 2)
        self.assertIn("<@toto>", sent_to)
        self.assertIn("slack_02", sent_to)

        call_command("slack_unvalidated", stdout=stdout.reset())
        self.assertTrue("Nothing to send" in stdout.data)
        self.assertFalse("Sent" in stdout.data)
        self.assertFalse("Error" in stdout.data)
        self.assertTrue("Success" in stdout.data)

        # Validating one planning
        response = SlackTestCase.client.post("/api/workdays/validate_planning/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Only 1/1 notifications
        call_command("slack_unplanned", stdout=stdout.reset())
        self.assertFalse("Nothing to send" in stdout.data)
        self.assertTrue("Sent" in stdout.data)
        self.assertTrue("Error during request" in stdout.data)  # No actual slack server
        self.assertTrue("Success" in stdout.data)
        sent_to = (
            [a for a in stdout.data.split("\n") if "Sent" in a][0]
            .split(": ")[1]
            .split(", ")
        )
        self.assertEqual(len(sent_to), 1)
        self.assertIn("slack_02", sent_to)

        call_command("slack_unvalidated", stdout=stdout.reset())
        self.assertFalse("Nothing to send" in stdout.data)
        self.assertTrue("Sent" in stdout.data)
        self.assertTrue("Error" in stdout.data)
        self.assertTrue("Success" in stdout.data)
        sent_to = (
            [a for a in stdout.data.split("\n") if "Sent" in a][0]
            .split(": ")[1]
            .split(", ")
        )
        self.assertEqual(len(sent_to), 1)
        self.assertIn("<@toto>", sent_to)

        # Validating the other planning
        response = SlackTestCase.client2.post("/api/workdays/validate_planning/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Only 0/2 notifications
        call_command("slack_unplanned", stdout=stdout.reset())
        self.assertTrue("Nothing to send" in stdout.data)
        self.assertFalse("Sent" in stdout.data)
        self.assertFalse("Error during request" in stdout.data)
        self.assertTrue("Success" in stdout.data)

        call_command("slack_unvalidated", stdout=stdout.reset())
        self.assertFalse("Nothing to send" in stdout.data)
        self.assertTrue("Sent" in stdout.data)
        self.assertTrue("Error" in stdout.data)
        self.assertTrue("Success" in stdout.data)
        sent_to = (
            [a for a in stdout.data.split("\n") if "Sent" in a][0]
            .split(": ")[1]
            .split(", ")
        )
        self.assertEqual(len(sent_to), 2)
        self.assertIn("<@toto>", sent_to)
        self.assertIn("slack_02", sent_to)

        # Validating one workday
        response = SlackTestCase.client2.post("/api/workdays/validate_working/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Only 0/1 notifications
        call_command("slack_unplanned", stdout=stdout.reset())
        self.assertTrue("Nothing to send" in stdout.data)
        self.assertFalse("Sent" in stdout.data)
        self.assertFalse("Error during request" in stdout.data)
        self.assertTrue("Success" in stdout.data)

        call_command("slack_unvalidated", stdout=stdout.reset())
        self.assertFalse("Nothing to send" in stdout.data)
        self.assertTrue("Sent" in stdout.data)
        self.assertTrue("Error" in stdout.data)
        self.assertTrue("Success" in stdout.data)
        sent_to = (
            [a for a in stdout.data.split("\n") if "Sent" in a][0]
            .split(": ")[1]
            .split(", ")
        )
        self.assertEqual(len(sent_to), 1)
        self.assertIn("<@toto>", sent_to)

        # Validating last workday
        response = SlackTestCase.client.post("/api/workdays/validate_working/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # No notification
        call_command("slack_unplanned", stdout=stdout.reset())
        self.assertTrue("Nothing to send" in stdout.data)
        self.assertFalse("Sent" in stdout.data)
        self.assertFalse("Error during request" in stdout.data)
        self.assertTrue("Success" in stdout.data)

        call_command("slack_unvalidated", stdout=stdout.reset())
        self.assertTrue("Nothing to send" in stdout.data)
        self.assertFalse("Sent" in stdout.data)
        self.assertFalse("Error during request" in stdout.data)
        self.assertTrue("Success" in stdout.data)
