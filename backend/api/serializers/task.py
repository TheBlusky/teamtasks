from rest_framework import serializers


class TaskSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    label = serializers.CharField(max_length=64)
    comments_planning = serializers.CharField(allow_blank=True)
    comments_validation = serializers.CharField(allow_blank=True)
    done = serializers.BooleanField()
    planned = serializers.BooleanField()
    progress = serializers.IntegerField()


class SuggestionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    label = serializers.CharField()


class PlanningTaskSerializer(serializers.Serializer):
    label = serializers.CharField(max_length=64)
    comments_planning = serializers.CharField(allow_blank=True)


class WorkingUnplannedTaskSerializer(serializers.Serializer):
    label = serializers.CharField(max_length=64)
    comments_validation = serializers.CharField(allow_blank=True)
    progress = serializers.IntegerField()
    done = serializers.BooleanField(default=False)


class WorkingPlannedTaskSerializer(serializers.Serializer):
    comments_validation = serializers.CharField(allow_blank=True)
    progress = serializers.IntegerField()
    done = serializers.BooleanField(default=False)
