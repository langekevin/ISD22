from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.forms import User
from .forms import NewUserForm
from .models import Score


def index(request):
    """
    Returns the index.html for testing purposes
    """
    form = AuthenticationForm()
    return render(request, 'index.html', {'form': form})


def login_view(request):
    """
    Handles the login process for a user.
    """
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
    """
    View for registering a user. Creates the NewUserForm and renders the template for a GET
    request and registers the user on a POST.

    :param request:
    :return:
    """
    if request.method == 'POST':
        form = NewUserForm(request.POST)
        if not form.is_valid():
            return render(request, 'registration.html', {'form': form, 'errors': form.errors})

        user = form.save()
        login(request, user)
        return redirect('pacman')

    form = NewUserForm()
    return render(request, 'registration.html', {'form': form})
