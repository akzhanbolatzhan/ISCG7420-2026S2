
import { useEffect, useState } from 'react';
import axios from 'axios';

function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
const [slots, setSlots] = useState([]);
const [editingId, setEditingId] = useState(null);
const [selectedSlot, setSelectedSlot] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('Please log in to view your appointments.');
            setLoading(false);
            return;
        }

        axios.get('/api/appointments/', {
            headers: {
                Authorization: 'Token ' + token
            }
        })
        .then((response) => {
            setAppointments(response.data);
        })
        .catch((error) => {
            console.error(error);
            setError('Failed to load appointments.');
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

function handleEdit(appointment) {
    setEditingId(appointment.id);
    setSelectedSlot('');
    setSlots([]);
    setError('');

    axios.get('/api/appointment-slots/')
        .then((response) => {
            setSlots(response.data);
        })
        .catch((error) => {
            console.error(error);
            setError('Failed to load available slots.');
        });
}

    return (
        <div>
            <h2>My Appointments</h2>

            {loading && <p>Loading appointments...</p>}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {!loading && !error && appointments.length === 0 && (
                <p>You have no appointments.</p>
            )}

            {!loading && !error && appointments.length > 0 && (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment.id}>
                                <td>{appointment.id}</td>
                                <td>{appointment.doctor_name}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleEdit(appointment)}>
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

{editingId !== null && (
    <div className="mt-4">
        <h4>Update Appointment #{editingId}</h4>

        <label className="form-label">
            Select New Appointment Time
        </label>

        <select
            className="form-select mb-3"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
        >
            <option value="">Select a time</option>

            {slots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                    {slot.doctor_name} - {slot.date} - {slot.time}
                </option>
            ))}
        </select>

        {slots.length === 0 && (
            <p>No available appointment slots.</p>
        )}

        <button
            className="btn btn-secondary"
            onClick={() => setEditingId(null)}
        >
            Close
        </button>
    </div>
)}
        </div>
    );
}

export default MyAppointments;
