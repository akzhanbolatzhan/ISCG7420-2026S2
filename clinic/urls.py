# from django.urls import path
#
# from clinic.views import home, doctors, doctor_detail
#
#
# urlpatterns = [
#     path("", home, name="home"),
#     path("doctors/", doctors, name="doctors"),
#     path("doctor/<int:doctor_id>/", doctor_detail, name="doctor_detail"),
# ]

from django.urls import path

from clinic.views import (
    home,
    doctors,
    doctor_detail,
    register_view,
    register,
book_appointment,
    my_appointments,
edit_appointment,
cancel_appointment,
dashboard,
manage_doctors,
add_doctor_view,
add_doctor,
edit_doctor,
delete_doctor,
manage_appointment_slots,
add_appointment_slot_view,
add_appointment_slot,
edit_appointment_slot,
delete_appointment_slot,
manage_appointments,
admin_edit_appointment,
admin_cancel_appointment,
manage_patients,
edit_patient,
delete_patient,
login_redirect
)


urlpatterns = [
    path("", home, name="home"),
    path("doctors/", doctors, name="doctors"),
    path("doctor/<int:doctor_id>/",
         doctor_detail,
         name="doctor_detail"),

    path("register_form/",
         register_view,
         name="register_form"),

    path("register/",
         register,
         name="register"),


path("appointment/book/",
     book_appointment,
     name="book_appointment"),

path("appointments/",
     my_appointments,
     name="my_appointments"),


path("appointment/edit/<int:appointment_id>/",
     edit_appointment,
     name="edit_appointment"),

path("appointment/cancel/<int:appointment_id>/",
     cancel_appointment,
     name="cancel_appointment"),


path("dashboard/",
     dashboard,
     name="dashboard"),

path("dashboard/doctors/",
     manage_doctors,
     name="manage_doctors"),



path("dashboard/doctors/add/",
     add_doctor_view,
     name="add_doctor_view"),

path("dashboard/doctors/create/",
     add_doctor,
     name="add_doctor"),


path("dashboard/doctors/edit/<int:doctor_id>/",
     edit_doctor,
     name="edit_doctor"),



path("dashboard/doctors/delete/<int:doctor_id>/",
     delete_doctor,
     name="delete_doctor"),


path("dashboard/appointment-slots/",
     manage_appointment_slots,
     name="manage_appointment_slots"),

path("dashboard/appointment-slots/add/",
     add_appointment_slot_view,
     name="add_appointment_slot_view"),

path("dashboard/appointment-slots/create/",
     add_appointment_slot,
     name="add_appointment_slot"),

path("dashboard/appointment-slots/edit/<int:slot_id>/",
     edit_appointment_slot,
     name="edit_appointment_slot"),

path("dashboard/appointment-slots/delete/<int:slot_id>/",
     delete_appointment_slot,
     name="delete_appointment_slot"),

path("dashboard/appointments/",
     manage_appointments,
     name="manage_appointments"),

path("dashboard/appointments/edit/<int:appointment_id>/",
     admin_edit_appointment,
     name="admin_edit_appointment"),


path("dashboard/appointments/cancel/<int:appointment_id>/",
     admin_cancel_appointment,
     name="admin_cancel_appointment"),


path("dashboard/patients/",
     manage_patients,
     name="manage_patients"),

path("dashboard/patients/edit/<int:patient_id>/",
     edit_patient,
     name="edit_patient"),


path("dashboard/patients/delete/<int:patient_id>/",
     delete_patient,
     name="delete_patient"),

path("login-redirect/",
     login_redirect,
     name="login_redirect"),
]