from django.contrib import admin
from django.conf import settings
from django.urls import path
from . import views

urlpatterns = [
    path('pacman', views.pacman),
]