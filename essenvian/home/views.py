from django.shortcuts import render, redirect
from .forms import ContactForm


def home(request):
    return render(request, 'home/index.html')


def applications(request):
    return render(request, 'home/applications.html')


def innovation(request):
    return render(request, 'home/innovation.html')


def about(request):
    return render(request, 'home/about.html')


def contact(request):
    success = False
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            success = True
            form = ContactForm()
    else:
        form = ContactForm()
    return render(request, 'home/contact.html', {'form': form, 'success': success})