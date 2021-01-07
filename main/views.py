from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Client, Subscriber
from datetime import datetime


# Create your views here.
def index(request):
    return render(request, 'index.html')

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