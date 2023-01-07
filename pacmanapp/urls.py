from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login_view, name='login'),
    path('pacman', views.pacman, name='pacman'),
    path('profile', views.profile, name='profile'),
    path('registration', views.registration, name='registration'),
]
