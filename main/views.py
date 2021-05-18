from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Client, Subscriber, Project
from datetime import datetime


# Create your views here.
def index(request):
    context = {
        'all_projects': Project.objects.all(),
    }
    return render(request, 'index.html', context)


def portfolioDetails(request, project_id):
    context = {
        'project': Project.objects.get(id=project_id)
    }
    
    return render(request, 'portfolio-details.html', context)


def aboutbww(request):
    return render(request, 'aboutBWW.html')

def contact(request):
    errors = Client.objects.client_validator(request.POST)
    if len(errors) > 0:
        for message in errors.values():
            messages.error(request, message)
        return redirect("/failed")
    Client.objects.create(
        name=request.POST['name'],
        email=request.POST['email'],
        subject=request.POST['subject'],
        comment=request.POST['comment'],
    )
    return redirect('/success')

def subscribe(request):
    errors = Subscriber.objects.subscriber_validator(request.POST)
    if len(errors) > 0:
        for message in errors.values():
            messages.error(request, message)
        return redirect('/')
    Subscriber.objects.create(
        email=request.POST['email'],
    )
    return redirect('/')

def success(request):
    return render(request, 'success.html')

def failed(request):
    return render(request, 'failed.html')

def photography(request):
    return render(request, 'inner-page.html')

def graphicDesign(request):
    return render(request, 'portfolio-details.html')

def articles(request):
    return render(request, 'about-inner-page.html')