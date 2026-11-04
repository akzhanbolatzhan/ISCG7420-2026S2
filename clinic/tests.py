from django.test import TestCase

# Create your tests here.

from datetime import time, timedelta

from django.contrib.auth.models import User
from django.urls import reverse
from django.utils import timezone

from rest_framework import status
from rest_framework.test import APITestCase

from .models import Doctor, AppointmentSlot, Appointment
from rest_framework.authtoken.models import Token

class ClinicAPITests(APITestCase):

    def setUp(self):
        # Create two doctors
        self.doctor = Doctor.objects.create(
            name="Dr. Smith",
            specialty="General Practitioner",
            bio="Test doctor"
        )

        self.other_doctor = Doctor.objects.create(
            name="Dr. Lee",
            specialty="Cardiology"
        )

        tomorrow = timezone.localdate() + timedelta(days=1)
        yesterday = timezone.localdate() - timedelta(days=1)

        # Create an available future slot
        self.available_slot = AppointmentSlot.objects.create(
            doctor=self.doctor,
            date=tomorrow,
            time=time(10, 0)
        )

        # Create a booked future slot
        self.booked_slot = AppointmentSlot.objects.create(
            doctor=self.doctor,
            date=tomorrow,
            time=time(11, 0)
        )

        # Create a slot for another doctor
        self.other_slot = AppointmentSlot.objects.create(
            doctor=self.other_doctor,
            date=tomorrow,
            time=time(12, 0)
        )

        # Create an expired slot
        self.past_slot = AppointmentSlot.objects.create(
            doctor=self.doctor,
            date=yesterday,
            time=time(9, 0)
        )

        # Book one appointment
        patient = User.objects.create_user(
            username="testpatient",
            password="TestPassword123!"
        )

        Appointment.objects.create(
            patient=patient,
            slot=self.booked_slot
        )

    def test_get_doctors(self):
        response = self.client.get(reverse('api-doctor-list'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_doctor_detail(self):
        response = self.client.get(
            reverse('api-doctor-detail', args=[self.doctor.id])
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Dr. Smith')

    def test_doctor_not_found(self):
        response = self.client.get(
            reverse('api-doctor-detail', args=[99999])
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND
        )

    def test_get_available_slots(self):
        response = self.client.get(reverse('api-available-slots'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        slot_ids = [slot['id'] for slot in response.data]

        self.assertIn(self.available_slot.id, slot_ids)
        self.assertIn(self.other_slot.id, slot_ids)
        self.assertNotIn(self.booked_slot.id, slot_ids)
        self.assertNotIn(self.past_slot.id, slot_ids)

    def test_filter_slots_by_doctor(self):
        response = self.client.get(
            reverse('api-available-slots'),
            {'doctor': self.doctor.id}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(
            response.data[0]['id'],
            self.available_slot.id
        )

    def test_invalid_doctor_filter(self):
        response = self.client.get(
            reverse('api-available-slots'),
            {'doctor': 'invalid'}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST
        )

    def test_doctor_api_is_read_only(self):
        response = self.client.post(
            reverse('api-doctor-list'),
            {
                'name': 'New Doctor',
                'specialty': 'General'
            }
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED
        )



class AuthenticationAPITests(APITestCase):

    def setUp(self):
        self.patient = User.objects.create_user(
            username='patient1',
            email='patient1@example.com',
            password='TestPassword123!'
        )

        self.admin_user = User.objects.create_user(
            username='admin1',
            email='admin1@example.com',
            password='TestPassword123!',
            is_staff=True
        )

    def authenticate(self, user):
        token, _ = Token.objects.get_or_create(user=user)
        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + token.key
        )
        return token

    def test_register_patient(self):
        response = self.client.post(
            reverse('api-register'),
            {
                'username': 'newpatient',
                'email': 'newpatient@example.com',
                'password': 'StrongPassword123!'
            },
            format='json'
        )

        self.assertEqual(response.status_code, 201)

        user = User.objects.get(username='newpatient')
        self.assertFalse(user.is_staff)
        self.assertTrue(user.check_password('StrongPassword123!'))
        self.assertNotIn('password', response.data)

    def test_register_duplicate_username(self):
        response = self.client.post(
            reverse('api-register'),
            {
                'username': 'patient1',
                'email': 'another@example.com',
                'password': 'StrongPassword123!'
            },
            format='json'
        )

        self.assertEqual(response.status_code, 400)

    def test_login_success(self):
        response = self.client.post(
            reverse('api-login'),
            {
                'username': 'patient1',
                'password': 'TestPassword123!'
            },
            format='json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)

    def test_login_invalid_password(self):
        response = self.client.post(
            reverse('api-login'),
            {
                'username': 'patient1',
                'password': 'wrongpassword'
            },
            format='json'
        )

        self.assertEqual(response.status_code, 400)

    def test_current_user_requires_login(self):
        response = self.client.get(reverse('api-current-user'))

        self.assertEqual(response.status_code, 401)

    def test_patient_profile(self):
        self.authenticate(self.patient)

        response = self.client.get(reverse('api-current-user'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], 'patient1')
        self.assertFalse(response.data['is_staff'])

    def test_patient_cannot_access_admin(self):
        self.authenticate(self.patient)

        response = self.client.get(reverse('api-admin-profile'))

        self.assertEqual(response.status_code, 403)

    def test_admin_can_access_admin(self):
        self.authenticate(self.admin_user)

        response = self.client.get(reverse('api-admin-profile'))

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_staff'])

    def test_logout_invalidates_token(self):
        self.authenticate(self.patient)

        response = self.client.post(reverse('api-logout'))

        self.assertEqual(response.status_code, 204)

        response = self.client.get(reverse('api-current-user'))

        self.assertEqual(response.status_code, 401)
