from django.db.models import Q
from django.utils import timezone

from rest_framework import generics
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny

from .models import Doctor, AppointmentSlot
from .serializers import DoctorSerializer, AppointmentSlotSerializer


class DoctorListAPIView(generics.ListAPIView):
    queryset = Doctor.objects.all().order_by('id')
    serializer_class = DoctorSerializer
    permission_classes = [AllowAny]


class DoctorDetailAPIView(generics.RetrieveAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [AllowAny]


class AvailableAppointmentSlotAPIView(generics.ListAPIView):
    serializer_class = AppointmentSlotSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        now = timezone.localtime()

        queryset = AppointmentSlot.objects.select_related(
            'doctor'
        ).filter(
            appointment__isnull=True
        ).filter(
            Q(date__gt=now.date()) |
            Q(date=now.date(), time__gte=now.time())
        ).order_by('date', 'time', 'id')

        doctor_id = self.request.query_params.get('doctor')

        if doctor_id is not None:
            if not doctor_id.isdecimal() or int(doctor_id) < 1:
                raise ValidationError({
                    'doctor': 'A valid doctor ID is required.'
                })

            queryset = queryset.filter(doctor_id=int(doctor_id))

        return queryset