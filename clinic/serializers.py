from rest_framework import serializers
from .models import Doctor, AppointmentSlot, Appointment
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone

class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'name', 'specialty', 'bio']


class AppointmentSlotSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(
        source='doctor.name',
        read_only=True
    )

    class Meta:
        model = AppointmentSlot
        fields = ['id', 'doctor', 'doctor_name', 'date', 'time']




User = get_user_model()


class RegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        read_only_fields = ['id']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "This email is already registered."
            )
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)



class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(
        source='slot.doctor.name',
        read_only=True
    )

    patient_username = serializers.CharField(
        source='patient.username',
        read_only=True
    )

    date = serializers.DateField(
        source='slot.date',
        read_only=True
    )
    time = serializers.TimeField(
        source='slot.time',
        read_only=True
    )

    class Meta:
        model = Appointment
        fields = [
            'id',
            'patient',
            'patient_username',
            'slot',
            'doctor_name',
            'date',
            'time',
            'created_at'
        ]
        read_only_fields = [
            'id',
            'patient',
            'created_at'
        ]

    def validate_slot(self, slot):
        now = timezone.localtime()

        # Check if the selected slot is in the past
        if (
                slot.date < now.date()
                or (
                slot.date == now.date()
                and slot.time <= now.time()
        )
        ):
            raise serializers.ValidationError(
                "Cannot book an appointment in the past."
            )

        # Check if the slot is already booked
        booked_appointments = Appointment.objects.filter(
            slot=slot
        )

        # Exclude the current appointment when updating
        if self.instance is not None:
            booked_appointments = booked_appointments.exclude(
                pk=self.instance.pk
            )

        if booked_appointments.exists():
            raise serializers.ValidationError(
                "This appointment slot is already booked."
            )

        return slot
