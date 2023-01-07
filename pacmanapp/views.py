"""
File for the endpoint definitions
"""
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .forms import NewUserForm
from .models import Score


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
        return render(request, 'pacman.html', {})
    return redirect('login')


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


def registration(request):
    if request.method == 'POST':
        form = NewUserForm(request.POST)
        if not form.is_valid():
            return render(request, 'registration.html', {'form': form, 'errors': form.errors})

        user = form.save()
        login(request, user)
        return redirect('pacman')
    form = NewUserForm()
    return render(request, 'registration.html', {'form': form})


class HighScore(APIView):
    """
    Endpoints for managing high scores
    """

    def get(self, request):
        """Endpoint for get request for requesting the current high score of
        a player if the high score is available.
        """
        if request.user.is_authenticated:
            user = request.user
            score = Score.objects.filter(player=user).first()
            high_score = 0
            if score:
                high_score = score.score
            data = {'highScore': high_score}
            return Response(data, status=200)
        return Response(status=401)

    def post(self, request):
        """Endpoint for post request after playing pacman for updating the
        score of an user if the score exceeds the current high score.
        """
        if request.user.is_authenticated:
            data = request.data
            new_score = 0
            try:
                new_score = int(data.get("score"))
            except:
                pass

            if not new_score:
                return Response("Score was not found in the request", status=status.HTTP_400_BAD_REQUEST)

            user = request.user
            score = Score.objects.filter(player=user).first()
            if not score:
                Score.objects.create(player=user, score=new_score)
            elif score.score < new_score:
                score.score = new_score
                score.save()

        return Response(status=status.HTTP_201_CREATED)
