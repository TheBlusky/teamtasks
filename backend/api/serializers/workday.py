from rest_framework import serializers

from api.serializers.task import TaskSerializer


class CreateSerializer(serializers.Serializer):
    day = serializers.DateField()


class WorkdaySerializer(serializers.Serializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    task_set = TaskSerializer(many=True)
    day = serializers.DateField()
    created_at = serializers.DateTimeField()
    planned_at = serializers.DateTimeField()
    validated_at = serializers.DateTimeField()
