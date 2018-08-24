# Generated by Django 2.1 on 2018-08-24 13:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [("core", "0003_auto_20180818_1605")]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="current_workday",
            field=models.ForeignKey(
                blank=True,
                default=None,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="+",
                to="core.WorkDay",
            ),
        )
    ]