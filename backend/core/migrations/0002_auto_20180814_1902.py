# Generated by Django 2.1 on 2018-08-14 19:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("core", "0001_initial")]

    operations = [
        migrations.AlterField(
            model_name="task", name="label", field=models.CharField(max_length=64)
        )
    ]
