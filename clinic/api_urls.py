from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

from .api_views import (
    DoctorListAPIView,
    DoctorDetailAPIView,
    AvailableAppointmentSlotAPIView,
    RegisterAPIView,
    CurrentUserAPIView,
    LogoutAPIView,
    AdminProfileAPIView,
    PatientAppointmentListCreateAPIView,
    PatientAppointmentDetailAPIView,
    AdminAppointmentListAPIView,
    AdminAppointmentDetailAPIView,
    AdminDoctorCreateAPIView,
    AdminDoctorUpdateAPIView,
    AdminAppointmentSlotCreateAPIView,
    AdminAppointmentSlotUpdateAPIView
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

urlpatterns += [
    path(
        'appointments/',
        PatientAppointmentListCreateAPIView.as_view(),
        name='api-my-appointments'
    ),
]

urlpatterns += [
    path(
        'appointments/<int:pk>/',
        PatientAppointmentDetailAPIView.as_view(),
        name='api-appointment-detail'
    ),
]

urlpatterns += [
    path(
        'admin/appointments/',
        AdminAppointmentListAPIView.as_view(),
        name='api-admin-appointments'
    ),
    path(
        'admin/appointments/<int:pk>/',
        AdminAppointmentDetailAPIView.as_view(),
        name='api-admin-appointment-detail'
    ),
]



urlpatterns += [
    path(
        'admin/doctors/',
        AdminDoctorCreateAPIView.as_view(),
        name='api-admin-doctor-create'
    ),
]


urlpatterns += [
    path(
        'admin/doctors/<int:pk>/',
        AdminDoctorUpdateAPIView.as_view(),
        name='api-admin-doctor-update'
    ),
]

urlpatterns += [
    path(
        'admin/appointment-slots/',
        AdminAppointmentSlotCreateAPIView.as_view(),
        name='api-admin-slot-create'
    ),
]

urlpatterns += [
    path(
        'admin/appointment-slots/<int:pk>/',
        AdminAppointmentSlotUpdateAPIView.as_view(),
        name='api-admin-slot-update'
    ),
]

