from django.contrib import admin
from .models import Client, Subscriber, Project


# Register your models here.
@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "comment", "created_at")


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "created_at")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "description", "image_one", "image_two", "image_three", "category", "client", "project_date", "project_url"]

