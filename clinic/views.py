from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib import messages

# Create your views here.
from clinic.models import Doctor, AppointmentSlot, Appointment


# Create your views here.
def home(request):
    return render(request, "clinic/home.html")


def doctors(request):
    doctors = Doctor.objects.all()

    return render(request,
                  "clinic/doctors.html",
                  {"doctors": doctors})


def doctor_detail(request, doctor_id):
    doctor = Doctor.objects.get(id=doctor_id)

    appointment_slots = AppointmentSlot.objects.filter(
        doctor=doctor,
        appointment__isnull=True
    )

    return render(request,
                  "clinic/doctor_detail.html",
                  {
                      "doctor": doctor,
                      "appointment_slots": appointment_slots
                  })



def register_view(request):
    return render(request, "clinic/register.html")


def register(request):
    username = request.POST["username"]
    password = request.POST["password"]
    email = request.POST["email"]
    if User.objects.filter(username=username).exists():
        return render(request, "clinic/register.html", {"error": "Username already exists."})
    user = User.objects.create_user(username=username, email=email)
    user.set_password(password)
    user.save()
    return redirect("login")



def book_appointment(request):
    if not request.user.is_authenticated:
        return redirect("login")
    slot_id = request.POST["slot_id"]
    slot = AppointmentSlot.objects.get(id=slot_id)
    if Appointment.objects.filter(slot=slot).exists():
        return redirect("doctor_detail", doctor_id=slot.doctor.id)
    Appointment.objects.create(patient=request.user, slot=slot)
    messages.success(request, "Appointment booked successfully.")
    return redirect("my_appointments")



def my_appointments(request):
    if not request.user.is_authenticated:
        return redirect("login")

    appointments = Appointment.objects.filter(
        patient=request.user
    )

    return render(request,
                  "clinic/my_appointments.html",
                  {"appointments": appointments})








def edit_appointment(request, appointment_id):
    if not request.user.is_authenticated:
        return redirect("login")

    appointment = Appointment.objects.get(id=appointment_id)

    if appointment.patient != request.user:
        return redirect("my_appointments")

    if request.method == "POST":
        slot_id = request.POST["slot_id"]

        new_slot = AppointmentSlot.objects.get(id=slot_id)

        if Appointment.objects.filter(slot=new_slot).exists():
            return redirect("edit_appointment",
                            appointment_id=appointment.id)

        appointment.slot = new_slot
        appointment.save()

        return redirect("my_appointments")

    appointment_slots = AppointmentSlot.objects.filter(
        appointment__isnull=True
    )

    return render(request,
                  "clinic/edit_appointment.html",
                  {
                      "appointment": appointment,
                      "appointment_slots": appointment_slots
                  })


def cancel_appointment(request, appointment_id):
    if not request.user.is_authenticated:
        return redirect("login")

    appointment = Appointment.objects.get(id=appointment_id)

    if appointment.patient != request.user:
        return redirect("my_appointments")

    if request.method == "POST":
        appointment.delete()

        return redirect("my_appointments")

    return render(request,
                  "clinic/cancel_appointment.html",
                  {"appointment": appointment})


def dashboard(request):
    if not request.user.is_authenticated:
        return redirect("login")

    if not request.user.is_staff:
        return redirect("home")

    doctors = Doctor.objects.all()
    appointment_slots = AppointmentSlot.objects.all()
    appointments = Appointment.objects.all()
    patients = User.objects.filter(is_staff=False)

    return render(request,
                  "clinic/dashboard.html",
                  {
                      "doctors": doctors,
                      "appointment_slots": appointment_slots,
                      "appointments": appointments,
                      "patients": patients
                  })


def manage_doctors(request):
    if not request.user.is_authenticated:
        return redirect("login")

    if not request.user.is_staff:
        return redirect("home")

    doctors = Doctor.objects.all()

    return render(request,
                  "clinic/manage_doctors.html",
                  {"doctors": doctors})


def add_doctor_view(request):
    if not request.user.is_authenticated:
        return redirect("login")

    if not request.user.is_staff:
        return redirect("home")

    return render(request,
                  "clinic/add_doctor.html")


def add_doctor(request):
    if not request.user.is_authenticated:
        return redirect("login")

    if not request.user.is_staff:
        return redirect("home")

    name = request.POST["name"]
    specialty = request.POST["specialty"]
    bio = request.POST["bio"]

    Doctor.objects.create(
        name=name,
        specialty=specialty,
        bio=bio
    )

    return redirect("manage_doctors")



def edit_doctor(request, doctor_id):
    if not request.user.is_authenticated:
        return redirect("login")

    if not request.user.is_staff:
        return redirect("home")

    doctor = Doctor.objects.get(id=doctor_id)

    if request.method == "POST":
        doctor.name = request.POST["name"]
        doctor.specialty = request.POST["specialty"]
        doctor.bio = request.POST["bio"]

        doctor.save()

        return redirect("manage_doctors")

    return render(request,
                  "clinic/edit_doctor.html",
                  {"doctor": doctor})




def delete_doctor(request, doctor_id):
    if not request.user.is_authenticated:
        return redirect("login")

    if not request.user.is_staff:
        return redirect("home")

    doctor = Doctor.objects.get(id=doctor_id)

    if request.method == "POST":
        doctor.delete()

        return redirect("manage_doctors")

    return render(request,
                  "clinic/delete_doctor.html",
                  {"doctor": doctor})



def manage_appointment_slots(request):
    if not request.user.is_authenticated:
        return redirect("login")

    if not request.user.is_staff:
        return redirect("home")

    appointment_slots = AppointmentSlot.objects.all()

    return render(request,
                  "clinic/manage_appointment_slots.html",
                  {"appointment_slots": appointment_slots})


def add_appointment_slot_view(request):
    if not request.user.is_authenticated:
        return redirect("login")
    if not request.user.is_staff:
        return redirect("home")
    doctors = Doctor.objects.all()
    return render(request,
                  "clinic/add_appointment_slot.html",
                  {"doctors": doctors})


def add_appointment_slot(request):
    if not request.user.is_authenticated:
        return redirect("login")
    if not request.user.is_staff:
        return redirect("home")

    doctor_id = request.POST["doctor"]
    date = request.POST["date"]
    time = request.POST["time"]

    doctor = Doctor.objects.get(id=doctor_id)

    AppointmentSlot.objects.create(
        doctor=doctor,
        date=date,
        time=time
    )

    return redirect("manage_appointment_slots")




def edit_appointment_slot(request, slot_id):
    if not request.user.is_authenticated:
        return redirect("login")
    if not request.user.is_staff:
        return redirect("home")

    slot = AppointmentSlot.objects.get(id=slot_id)
    doctors = Doctor.objects.all()

    if request.method == "POST":
        doctor_id = request.POST["doctor"]
        date = request.POST["date"]
        time = request.POST["time"]

        doctor = Doctor.objects.get(id=doctor_id)

        slot.doctor = doctor
        slot.date = date
        slot.time = time
        slot.save()

        return redirect("manage_appointment_slots")

    return render(request,
                  "clinic/edit_appointment_slot.html",
                  {
                      "slot": slot,
                      "doctors": doctors
                  })







def delete_appointment_slot(request, slot_id):
    if not request.user.is_authenticated:
        return redirect("login")
    if not request.user.is_staff:
        return redirect("home")

    slot = AppointmentSlot.objects.get(id=slot_id)

    if request.method == "POST":
        slot.delete()
        return redirect("manage_appointment_slots")

    return render(request,
                  "clinic/delete_appointment_slot.html",
                  {"slot": slot})




def manage_appointments(request):
    if not request.user.is_authenticated:
        return redirect("login")
    if not request.user.is_staff:
        return redirect("home")

    appointments = Appointment.objects.all()

    return render(request,
                  "clinic/manage_appointments.html",
                  {"appointments": appointments})



def admin_edit_appointment(request, appointment_id):
    if not request.user.is_authenticated:
        return redirect("login")
    if not request.user.is_staff:
        return redirect("home")

    appointment = Appointment.objects.get(id=appointment_id)

    if request.method == "POST":
        slot_id = request.POST["slot_id"]
        new_slot = AppointmentSlot.objects.get(id=slot_id)

        if Appointment.objects.filter(slot=new_slot).exclude(id=appointment.id).exists():
            return redirect("admin_edit_appointment",
                            appointment_id=appointment.id)

        appointment.slot = new_slot
        appointment.save()

        return redirect("manage_appointments")

    appointment_slots = AppointmentSlot.objects.filter(
        appointment__isnull=True
    )

    return render(request,
                  "clinic/admin_edit_appointment.html",
                  {
                      "appointment": appointment,
                      "appointment_slots": appointment_slots
                  })







def admin_cancel_appointment(request, appointment_id):
    if not request.user.is_authenticated:
        return redirect("login")
    if not request.user.is_staff:
        return redirect("home")

    appointment = Appointment.objects.get(id=appointment_id)

    if request.method == "POST":
        appointment.delete()
        return redirect("manage_appointments")

    return render(request,
                  "clinic/admin_cancel_appointment.html",
                  {"appointment": appointment})



def manage_patients(request):
    if not request.user.is_authenticated:
        return redirect("login")
    if not request.user.is_staff:
        return redirect("home")

    patients = User.objects.filter(is_staff=False)

    return render(request,
                  "clinic/manage_patients.html",
                  {"patients": patients})




def edit_patient(request, patient_id):
    if not request.user.is_authenticated:
        return redirect("login")
    if not request.user.is_staff:
        return redirect("home")

    patient = User.objects.get(id=patient_id)

    if patient.is_staff:
        return redirect("manage_patients")

    if request.method == "POST":
        patient.username = request.POST["username"]
        patient.email = request.POST["email"]
        patient.save()

        return redirect("manage_patients")

    return render(request,
                  "clinic/edit_patient.html",
                  {"patient": patient})


def delete_patient(request, patient_id):
    if not request.user.is_authenticated:
        return redirect("login")
    if not request.user.is_staff:
        return redirect("home")

    patient = User.objects.get(id=patient_id)

    if patient.is_staff:
        return redirect("manage_patients")

    if request.method == "POST":
        patient.delete()
        return redirect("manage_patients")

    return render(request,
                  "clinic/delete_patient.html",
                  {"patient": patient})



def login_redirect(request):
    if request.user.is_staff:
        return redirect("dashboard")
    return redirect("home")