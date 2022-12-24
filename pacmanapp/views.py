from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm


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

def profile(requeest):
    """
    Returns the profile.html
    """
    return render(requeest, 'profile.html', {})


def registration(request):
    return render(request, 'registration.html', {})
