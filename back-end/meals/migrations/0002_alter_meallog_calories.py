# Generated by Django 5.1.7 on 2025-05-10 21:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('meals', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='meallog',
            name='calories',
            field=models.FloatField(),
        ),
    ]
