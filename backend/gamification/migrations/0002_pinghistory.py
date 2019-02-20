# Generated by Django 2.1 on 2019-02-06 17:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0005_auto_20180826_1324"),
        ("gamification", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="PingHistory",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("day", models.DateField(auto_now_add=True)),
                (
                    "pinged",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="+",
                        to="core.User",
                    ),
                ),
                (
                    "pinger",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="+",
                        to="core.User",
                    ),
                ),
            ],
        )
    ]
