from rest_framework import serializers


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=32)
    email = serializers.EmailField()
    password = serializers.CharField()


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class TeammateSerializer(serializers.Serializer):
    class DjangoUserSerialaier(serializers.Serializer):
        username = serializers.CharField()
        email = serializers.CharField()

    id = serializers.IntegerField()
    django_user = DjangoUserSerialaier()
    current_workday = serializers.PrimaryKeyRelatedField(read_only=True)
    is_admin = serializers.BooleanField()
