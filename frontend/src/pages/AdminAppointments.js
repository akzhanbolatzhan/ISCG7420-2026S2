import {useEffect, useState} from 'react';
import axios from 'axios';

function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [slots, setSlots] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [message, setMessage] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('Please log in as an administrator.');
            setLoading(false);
            return;
        }

        axios.get('/api/admin/appointments/', {
            headers: {
                Authorization: 'Token ' + token
            }
        })
            .then((response) => {
                setAppointments(response.data);
            })
            .catch((error) => {
                console.error(error);
                setError('Access denied or failed to load appointments.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    function handleEditAppointment(appointment) {
        setEditingId(appointment.id);
        setSelectedSlot('');
        setSlots([]);
        setMessage('');
        setFormError('');

        axios.get('/api/appointment-slots/')
            .then((response) => {
                setSlots(response.data);
            })
            .catch((error) => {
                console.error(error);
                setFormError('Failed to load available appointment slots.');
            });
    }
    useEffect(() => {
        if (editingId !== null) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [editingId]);
    function handleUpdateAppointment(event) {
        event.preventDefault();

        if (!selectedSlot) {
            setFormError('Please select a new appointment time.');
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            setFormError('Please log in as an administrator.');
            return;
        }

        setMessage('');
        setFormError('');

        axios.patch('/api/admin/appointments/' + editingId + '/', {
            slot: Number(selectedSlot)
        }, {
            headers: {
                Authorization: 'Token ' + token
            }
        })
            .then((response) => {
                setAppointments((currentAppointments) =>
                    currentAppointments.map((appointment) =>
                        appointment.id === editingId
                            ? response.data
                            : appointment
                    )
                );

                setMessage('Appointment updated successfully!');
                setEditingId(null);
                setSelectedSlot('');
            })
            .catch((error) => {
                console.error(error);
                setFormError('Failed to update appointment.');
            });
    }

    return (
        <div>
            <h2>Manage Appointments</h2>

            {loading && <p>Loading appointments...</p>}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {!loading && !error && appointments.length === 0 && (
                <p>No appointments found.</p>
            )}

            {!loading && !error && appointments.length > 0 && (
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Patient</th>
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
                            <td>{appointment.patient_username}</td>
                            <td>{appointment.doctor_name}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.time}</td>

                            <td>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleEditAppointment(appointment)}
                                >
                                    Edit
                                </button>
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {editingId !== null && (
                <div className="mt-4 mb-4">
                    <h4>Edit Appointment #{editingId}</h4>

                    <form onSubmit={handleUpdateAppointment}>
                        <div className="mb-3">
                            <label className="form-label">
                                Select New Appointment Time
                            </label>

                            <select
                                className="form-select"
                                value={selectedSlot}
                                onChange={(e) => setSelectedSlot(e.target.value)}
                                required
                            >
                                <option value="">Select a time</option>

                                {slots.map((slot) => (
                                    <option key={slot.id} value={slot.id}>
                                        {slot.doctor_name} - {slot.date} - {slot.time}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {slots.length === 0 && !formError && (
                            <p>No available appointment slots.</p>
                        )}

                        {formError && (
                            <div className="alert alert-danger">
                                {formError}
                            </div>
                        )}
                        {message && (
                            <div className="alert alert-success">
                                {message}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="btn btn-success me-2"
                            disabled={!selectedSlot}
                        >
                            Save Changes
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setEditingId(null)}
                        >
                            Close
                        </button>
                    </form>
                </div>
            )}

        </div>
    );
}

export default AdminAppointments;
