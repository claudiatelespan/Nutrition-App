# Generated by Django 5.1.7 on 2025-05-04 17:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('unit', models.CharField(max_length=50)),
                ('calories_per_unit', models.FloatField()),
                ('category', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Reteta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('calories', models.FloatField()),
                ('cuisine_type', models.CharField(max_length=100)),
                ('prep_time', models.IntegerField(help_text='Time in minutes')),
                ('difficulty', models.CharField(choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')], max_length=20)),
                ('meal_type', models.CharField(choices=[('breakfast', 'Breakfast'), ('lunch', 'Lunch'), ('dinner', 'Dinner')], max_length=50)),
                ('rating', models.FloatField(default=0)),
                ('image', models.ImageField(blank=True, null=True, upload_to='recipe_images/')),
            ],
        ),
        migrations.CreateModel(
            name='RetetaIngrediente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.FloatField()),
                ('ingredient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='recipes.ingredient')),
                ('reteta', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='recipes.reteta')),
            ],
        ),
    ]
