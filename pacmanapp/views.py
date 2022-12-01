from django.shortcuts import render

def index(request):
    """
    Returns the index.html for testing purposes
    """
    return render(request, 'index.html', {})


def pacman(request):
    """
    Returns the pacman.html
    """
    return render(request, 'pacman.html', {})

def profile(requeest):
    """
    Returns the profile.html
    """
    return render(requeest, 'profile.html', {})
