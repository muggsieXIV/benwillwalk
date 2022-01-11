from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('portfolio-details/<int:project_id>', views.portfolioDetails),
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
