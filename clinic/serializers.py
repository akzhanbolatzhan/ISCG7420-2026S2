from rest_framework import serializers
from .models import Doctor, AppointmentSlot
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

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
