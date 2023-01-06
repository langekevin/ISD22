from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


def index(request):
    """
    Returns the index.html for testing purposes
    """
    form = AuthenticationForm()
    return render(request, 'index.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('pacman')
            else:
                print("user is not available")
        else:
            print("form is not valid")
    return redirect('index')


def pacman(request):
    """
    Returns the pacman.html
    """
    if request.user.is_authenticated:
        username = request.user.username
        pk = request.user.pk
        print(pk)
        print(username)
    return render(request, 'pacman.html', {})

def profile(request):
    """
    Returns the profile.html
    """
    if not request.user.is_authenticated:
        return redirect('index')

    user = request.user
    score = Score.objects.filter(player=user).first()
    if score is None:
        score = Score(player=user, score=0)

    high_scores = Score.objects.order_by('-score')[:3]

    return render(request, 'profile.html', {'score': score, 'high_scores': high_scores})


@api_view(('GET', 'POST', ))
def change_username(request, new_username: str = ''):

    if request.method != 'POST':
        response = Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
        return response

    response = Response(status=status.HTTP_200_OK)
    return response


def registration(request):
    return render(request, 'registration.html', {})


class HighScore(APIView):
    
    def get(self, request):
        # TODO: Get the high score of the player
        data = {'highScore': 10290}
        return Response(data, status=200)
    
    def post(self, request):
        # TODO: Save the new high score of the user if it is a high score
        return Response(status=201)