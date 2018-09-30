from django.apps import AppConfig


class SlackConfig(AppConfig):
    name = "slack"

    def ready(self):
        import slack.signals  # noqa
