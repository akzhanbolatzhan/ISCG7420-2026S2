from django.urls import path

from .api_views import (
    DoctorListAPIView,
    DoctorDetailAPIView,
    AvailableAppointmentSlotAPIView
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