from django.shortcuts import render

# Create your views here.
def flappybird(request):
    return render(request, 'flappybird.html')

