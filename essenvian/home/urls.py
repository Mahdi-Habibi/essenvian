
from django.urls import path
from . import views

app_name = 'home'
urlpatterns = [
    path('', views.home, name='home'),
    path('applications/', views.applications, name='applications'),
    path('innovation/', views.innovation, name='innovation'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
]
