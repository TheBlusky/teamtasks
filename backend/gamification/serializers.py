from rest_framework import serializers

from gamification.utils import xp_needed_for_level_up, hp_max_with_level


class UserLevelSerializer(serializers.Serializer):
    level = serializers.IntegerField()
    xp = serializers.IntegerField()
    xp_required = serializers.SerializerMethodField()
    hp = serializers.IntegerField()
    hp_max = serializers.SerializerMethodField()

    def get_xp_required(self, obj):
        return xp_needed_for_level_up(obj.level)

    def get_hp_max(self, obj):
        return hp_max_with_level(obj.level)


class Notification(serializers.Serializer):
    created_at = serializers.DateTimeField()
    field = serializers.CharField()
    message = serializers.CharField()
    amount = serializers.IntegerField()
    read = serializers.BooleanField()
