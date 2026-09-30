from django.contrib import admin

# Register your models here.
from django.contrib import admin

from clinic.models import (Doctor, AppointmentSlot,
                           Appointment)

# Register your models here.
admin.site.register(Doctor)
admin.site.register(AppointmentSlot)
admin.site.register(Appointment)