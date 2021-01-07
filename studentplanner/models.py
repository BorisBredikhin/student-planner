from typing import Iterable

import datetime
from django.contrib.auth import get_user_model
from django.db import models


def get_disciplines(text: str) -> Iterable['Discipline']:
    return text_to_objects(text, Discipline.objects)


def get_teachers(text: str) -> Iterable['Teacher']:
    return text_to_objects(text, Teacher.objects)


def get_tasks(text: str) -> Iterable['Task']:
    return text_to_objects(text, Task.objects)


def text_to_objects(text, objects):
    if text == '[]':
        return []
    return map(lambda pk: objects.get(pk=pk),
               map(lambda pk: int(pk.strip()), text[1:-1].split(',')))


class Semester(models.Model):
    user = models.ForeignKey(get_user_model(), models.CASCADE, verbose_name="Пользователь")
    name = models.CharField(max_length=50, verbose_name="Название")
    start_date = models.DateField(verbose_name="Дата начала")
    end_date = models.DateField(verbose_name="Дата окончания")
    disciplines = models.TextField(default="[]", verbose_name="Дисциплины")

    def is_current(self):
        return self.start_date <= datetime.datetime.now() <= self.end_date

    @classmethod
    def current_only(self, uid=None):
        return filter(
            lambda x: x.is_current,
            self.objects.all()
                if uid is None
            else self.objects.filter(user=uid)
        )

    def get_avg_mark(self):
        disciplines = list(get_disciplines(self.disciplines))
        return sum(map(lambda d: d.get_avg_mark(), disciplines))/len(disciplines) if len(disciplines) > 0 else 0


class Teacher(models.Model):
    user = models.ForeignKey(get_user_model(), models.CASCADE, verbose_name="Пользователь")
    name = models.CharField(max_length=50, verbose_name="Имя")
    disciplines = models.TextField(default="[]", verbose_name="Дисциплины")


class Discipline(models.Model):
    user = models.ForeignKey(get_user_model(), models.CASCADE, verbose_name="Пользователь")
    name = models.CharField(max_length=200, verbose_name="Название")
    semester = models.ForeignKey('Semester', models.CASCADE, verbose_name="Семестр")
    teachers = models.TextField(default="[]", verbose_name="Преподаватели")
    tasks = models.TextField(default="[]", verbose_name="Задания")

    @property
    def is_current(self):
        return self.semester.start_date <= datetime.datetime.now() <= self.semester.end_date

    @classmethod
    def currenr_only(self):
        return filter(lambda x: x.is_current, self.semester.objects.all())


    def get_avg_mark(self):
        disciplines_tasks = Task.objects.filter(discipline_id=self.pk)

        task_with_marks = disciplines_tasks.filter(mark_denominator__gt=0)
        avg_mark = 0
        n = 0

        for task in task_with_marks:
            avg_mark += task.mark_numerator
            n += task.mark_denominator

        return avg_mark/n if n > 0 else 0


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
    mark_numerator = models.IntegerField(null=True, blank=True)
    mark_denominator = models.IntegerField(null=True, blank=True)
    due_time = models.DateField(verbose_name="Сдать до")
    priority = models.IntegerField(verbose_name="Приоритет")
    pass_to = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=True, verbose_name="Сдать", blank=True)
    weight = models.ForeignKey(Weight, models.SET_NULL, null=True, verbose_name='Вес', blank=True)
    is_completed = models.BooleanField(default=False, verbose_name="Завершено?")

    @property
    def is_current(self):
        return datetime.datetime.now().date() <= self.due_time

    @classmethod
    def current_only(self, uid):
        return filter(lambda x: x.is_current, Task.objects.filter(user_id=uid))
