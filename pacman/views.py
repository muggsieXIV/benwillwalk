from django.shortcuts import render

# Create your views here.
def pacman(request):
    return render(request, 'pacman.html')