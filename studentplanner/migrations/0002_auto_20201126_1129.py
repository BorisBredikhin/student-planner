# Generated by Django 3.1.3 on 2020-11-26 06:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('studentplanner', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='semester',
            old_name='disiplines',
            new_name='disciplines',
        ),
        migrations.RenameField(
            model_name='teacher',
            old_name='disiplines',
            new_name='disciplines',
        ),
    ]