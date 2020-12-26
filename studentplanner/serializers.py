from rest_framework import serializers
from . import models as m

class SemesterSerializer(serializers.ModelSerializer):
    # user = serializers.PrimaryKeyRelatedField()

    class Meta:
        model = m.Semester
        fields = ('id', 'name', 'start_date', 'end_date', 'disciplines')
        extra_kwargs = {'user': {'required': False}}

class TeacherSerializer(serializers.ModelSerializer):
    # user = serializers.PrimaryKeyRelatedField()

    class Meta:
        model = m.Teacher
        fields = '__all__'
        extra_kwargs = {'user': {'required': False}}

class DisciplineSerializer(serializers.ModelSerializer):
    # user = serializers.PrimaryKeyRelatedField()

    class Meta:
       model = m.Discipline
       fields = '__all__'
       extra_kwargs = {'user': {'required': False}}

class WeightSerializer(serializers.ModelSerializer):
    # user = serializers.PrimaryKeyRelatedField()

    class Meta:
        model = m.Weight
        fields = '__all__'
        extra_kwargs = {'user': {'required': False}}

class TaskSerializer(serializers.ModelSerializer):
    # user = serializers.PrimaryKeyRelatedField()

    class Meta:
        model = m.Task
        fields = (
            'title',
            'description',
            'discipline',
            'mark_numerator',
            'mark_denominator',
            'due_time',
            'priority',
            'pass_to',
            'weight',
            'is_completed',
        )
        extra_kwargs = {
            'user': {'required': False},
            'mark_numerator': {'required': False},
            'mark_denominator': {'required': False},
            'pass_to': {'required': False},
            'weight': {'required': False},
        }