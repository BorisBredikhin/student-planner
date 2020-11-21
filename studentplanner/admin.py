from django.contrib import admin

from . import models

# Register your models here.
admin.site.register(models.Discipline)
admin.site.register(models.Semester)
admin.site.register(models.Task)
admin.site.register(models.Weight)
admin.site.register(models.Teacher)
