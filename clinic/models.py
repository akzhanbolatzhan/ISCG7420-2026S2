from django.db import models

# Create your models here.
from django.contrib.auth.models import User
from django.db import models


class Doctor(models.Model):
    name = models.CharField(max_length=100)
    specialty = models.CharField(max_length=100)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class AppointmentSlot(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()

    def __str__(self):
        return self.doctor.name + " - " + str(self.date) + " " + str(self.time)


class Appointment(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE)
    slot = models.OneToOneField(AppointmentSlot, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.patient.username + " - " + str(self.slot)