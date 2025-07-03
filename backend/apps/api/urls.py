from django.urls import path
from .views import HelloView, HelloDearView

urlpatterns = [
    path('hello/', HelloView.as_view(), name='hello'),
    path('hello-dear/', HelloDearView.as_view(), name='hello-dear'),
]
