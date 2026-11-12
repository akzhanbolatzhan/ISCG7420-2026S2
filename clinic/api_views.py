from django.db.models import Q
from django.utils import timezone

from rest_framework.exceptions import ValidationError
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .models import Doctor, AppointmentSlot, Appointment
from .serializers import DoctorSerializer, AppointmentSlotSerializer
from django.db import IntegrityError, transaction
from .serializers import AppointmentSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RegistrationSerializer

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


class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [AllowAny]


class CurrentUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff
        })


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.auth.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminProfileAPIView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'is_staff': request.user.is_staff
        })


class PatientAppointmentListCreateAPIView(
    generics.ListCreateAPIView
):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Appointment.objects.filter(
            patient=self.request.user
        ).select_related(
            'slot__doctor'
        ).order_by('-created_at')

    def perform_create(self, serializer):
        try:
            with transaction.atomic():
                serializer.save(
                    patient=self.request.user
                )
        except IntegrityError:
            raise ValidationError({
                'slot': 'This appointment slot is already booked.'
            })


class PatientAppointmentDetailAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    http_method_names = [
        'get', 'patch', 'delete', 'head', 'options'
    ]

    def get_queryset(self):
        return Appointment.objects.filter(
            patient=self.request.user
        ).select_related('slot__doctor')

    def perform_update(self, serializer):
        try:
            with transaction.atomic():
                serializer.save()
        except IntegrityError:
            raise ValidationError({
                'slot': 'This appointment slot is already booked.'
            })


class AdminAppointmentListAPIView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Appointment.objects.select_related(
            'patient',
            'slot__doctor'
        ).order_by('-created_at')


class AdminAppointmentDetailAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAdminUser]

    http_method_names = [
        'get', 'patch', 'delete', 'head', 'options'
    ]

    def get_queryset(self):
        return Appointment.objects.select_related(
            'patient',
            'slot__doctor'
        )

    def perform_update(self, serializer):
        try:
            with transaction.atomic():
                serializer.save()
        except IntegrityError:
            raise ValidationError({
                'slot': 'This appointment slot is already booked.'
            })




class AdminDoctorCreateAPIView(generics.CreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAdminUser]




class AdminDoctorUpdateAPIView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAdminUser]

    http_method_names = [
        'get', 'patch', 'delete', 'head', 'options'
    ]

    def perform_destroy(self, instance):
        if Appointment.objects.filter(
            slot__doctor=instance
        ).exists():
            raise ValidationError({
                'detail': 'Cannot delete a doctor with existing appointments.'
            })

        instance.delete()



class AdminAppointmentSlotCreateAPIView(generics.CreateAPIView):
    queryset = AppointmentSlot.objects.all()
    serializer_class = AppointmentSlotSerializer
    permission_classes = [IsAdminUser]



class AdminAppointmentSlotUpdateAPIView(
    generics.RetrieveUpdateAPIView
):
    queryset = AppointmentSlot.objects.all()
    serializer_class = AppointmentSlotSerializer
    permission_classes = [IsAdminUser]

    http_method_names = [
        'get', 'patch', 'head', 'options'
    ]

    def perform_update(self, serializer):
        if Appointment.objects.filter(
            slot=serializer.instance
        ).exists():
            raise ValidationError({
                'detail': 'Cannot update a booked appointment slot.'
            })

        serializer.save()
