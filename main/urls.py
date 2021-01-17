from django.contrib import admin
from django.conf import settings
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('about-bww', views.aboutbww),
    # path('contact', views.contact),
    path('form/', views.contact),
    path('subscribe', views.subscribe),
    path('success', views.success),
    path('failed', views.failed),
    path('photography', views.photography),
    path('articles', views.articles),
    path('graphic-design', views.graphicDesign),
]
