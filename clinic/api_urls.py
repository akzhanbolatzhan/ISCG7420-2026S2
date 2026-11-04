from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from .api_views import (
    DoctorListAPIView,
    DoctorDetailAPIView,
    AvailableAppointmentSlotAPIView,
    RegisterAPIView,
    CurrentUserAPIView,
    LogoutAPIView,
    AdminProfileAPIView
)

urlpatterns = [
    path(
        'doctors/',
        DoctorListAPIView.as_view(),
        name='api-doctor-list'
    ),

    path(
        'doctors/<int:pk>/',
        DoctorDetailAPIView.as_view(),
        name='api-doctor-detail'
    ),

    path(
        'appointment-slots/',
        AvailableAppointmentSlotAPIView.as_view(),
        name='api-available-slots'
    ),
]

urlpatterns += [
    path(
        'auth/register/',
        RegisterAPIView.as_view(),
        name='api-register'
    ),
    path(
        'auth/login/',
        obtain_auth_token,
        name='api-login'
    ),
    path(
        'auth/me/',
        CurrentUserAPIView.as_view(),
        name='api-current-user'
    ),
    path(
        'auth/logout/',
        LogoutAPIView.as_view(),
        name='api-logout'
    ),
    path(
        'admin/profile/',
        AdminProfileAPIView.as_view(),
        name='api-admin-profile'
    ),
]
