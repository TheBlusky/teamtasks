from rest_framework import serializers


class UserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=32)


class CreateSerializer(serializers.Serializer):
    team_name = serializers.CharField()


class TeammateSerializer(serializers.Serializer):
    class DjangoUserSerialaier(serializers.Serializer):
        username = serializers.CharField()
        email = serializers.CharField()

    id = serializers.IntegerField()
    django_user = DjangoUserSerialaier()
    current_workday = serializers.IntegerField()
    is_admin = serializers.BooleanField()
    level = serializers.IntegerField()
    xp = serializers.IntegerField()
    hp = serializers.IntegerField()
