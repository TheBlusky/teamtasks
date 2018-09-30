from rest_framework import serializers


class TeamSlackSerializer(serializers.Serializer):
    activated = serializers.BooleanField(default=False)
    url = serializers.CharField(max_length=512)
    channel = serializers.CharField(max_length=64)
    users = serializers.JSONField()
