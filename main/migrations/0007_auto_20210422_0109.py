# Generated by Django 3.1.6 on 2021-04-22 01:09

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0006_project'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='project',
            options={'ordering': ('title', 'description', 'image_one', 'image_two', 'image_three', 'category', 'client', 'project_date', 'project_url', 'created_at')},
        ),
        migrations.RenameField(
            model_name='project',
            old_name='categoty',
            new_name='category',
        ),
    ]