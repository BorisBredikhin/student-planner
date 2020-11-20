from typing import Iterable

from django.contrib.auth import get_user_model
from django.db import models


def get_disciplines(text: str) -> Iterable['Discipline']:
    return text_to_objects(text, Discipline.objects)


def get_teachers(text: str) -> Iterable['Teacher']:
    return text_to_objects(text, Teacher.objects)


def text_to_objects(text, objects):
    return map(lambda pk: objects.get(pk=pk),
               map(lambda pk: int(pk.strip()), text[1:-1].split(',')))


class Semester(models.Model):
    user = models.ForeignKey(get_user_model(), models.CASCADE, verbose_name="Пользователь")
    name = models.CharField(max_length=50, verbose_name="Название")
    start_date = models.DateField(verbose_name="Дата начала")
    end_date = models.DateField(verbose_name="Дата окончания")
    disiplines = models.TextField(default="[]", verbose_name="Дисциплины")


class Teacher(models.Model):
    user = models.ForeignKey(get_user_model(), models.CASCADE, verbose_name="Пользователь")
    name = models.CharField(max_length=50, verbose_name="Имя")
    disiplines = models.TextField(default="[]", verbose_name="Дисциплины")


class Discipline(models.Model):
    user = models.ForeignKey(get_user_model(), models.CASCADE, verbose_name="Пользователь")
    name = models.CharField(max_length=200, verbose_name="Название")
    semester = models.ForeignKey('Semester', models.CASCADE, verbose_name="Семестр")
    teachers = models.TextField(default="[]", verbose_name="Преподаватели")
    tasks = models.TextField(default="[]", verbose_name="Задания")


class Weight(models.Model):
    user = models.ForeignKey(get_user_model(), models.CASCADE, verbose_name="Пользователь")
    label = models.CharField(max_length=20, verbose_name='Название')
    discipline = models.ForeignKey('Discipline', on_delete=models.CASCADE, verbose_name='Дисциплина')
    method = models.CharField(max_length=1, verbose_name='метод расчёта', choices=[('E', 'E'), ('W', 'W')])
    EQUAL_TASKS_WEIGHT = 'E'  # все задания данной категории имеют одинаковый вес
    WEIGHTED_TASKS_WEIGHT = 'W'  # все задания данной категории оцениваются по набранным баллам
    value = models.FloatField(verbose_name="Коэффициент")


class Task(models.Model):
    user = models.ForeignKey(get_user_model(), models.CASCADE, verbose_name="Пользователь")
    title = models.CharField(max_length=500, verbose_name="Заголовок")
    description = models.TextField(verbose_name="Описание")
    discipline = models.ForeignKey('Discipline', on_delete=models.CASCADE, verbose_name='Дисциплина')
    mark_numerator = models.IntegerField(null=True)
    mark_denominator = models.IntegerField(null=True)
    due_time = models.DateField(verbose_name="Сдать до")
    priority = models.IntegerField(verbose_name="Приоритет")
    pass_to = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=True, verbose_name="Сдать")
    weight = models.ForeignKey(Weight, models.SET_NULL, null=True, verbose_name='Вес')
    is_completed = models.BooleanField(default=False, verbose_name="Завершено?")
