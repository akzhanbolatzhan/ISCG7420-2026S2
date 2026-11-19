import {useEffect, useState} from 'react';
import axios from 'axios';

function AdminSlots() {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [doctorId, setDoctorId] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('Please log in as an administrator.');
            setLoading(false);
            return;
        }

        axios.get('/api/admin/appointment-slots/', {
            headers: {
                Authorization: 'Token ' + token
            }
        })

            .then((response) => {
                setSlots(response.data);

                return axios.get('/api/doctors/');
            })
            .then((response) => {
                setDoctors(response.data);
            })

            .catch((error) => {
                console.error(error);
                setError('Failed to load appointment slots.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    function handleAddSlot(event) {
        event.preventDefault();

        const token = localStorage.getItem('token');

        setMessage('');
        setFormError('');

        axios.post('/api/admin/appointment-slots/', {
            doctor: Number(doctorId),
            date: date,
            time: time
        }, {
            headers: {
                Authorization: 'Token ' + token
            }
        })
            .then((response) => {
                setSlots((currentSlots) => [
                    ...currentSlots,
                    response.data
                ]);

                setMessage('Appointment slot added successfully!');

                setDoctorId('');
                setDate('');
                setTime('');
            })
            .catch((error) => {
                console.error(error);
                setFormError('Failed to add appointment slot.');
            });
    }

    return (
        <div>
            <h2>Manage Appointment Slots</h2>

            {loading && <p>Loading appointment slots...</p>}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="mb-4">
                    <h4>Add Appointment Slot</h4>

                    {message && (
                        <div className="alert alert-success">
                            {message}
                        </div>
                    )}

                    {formError && (
                        <div className="alert alert-danger">
                            {formError}
                        </div>
                    )}

                    <form onSubmit={handleAddSlot}>
                        <div className="mb-3">
                            <label className="form-label">
                                Doctor
                            </label>

                            <select
                                className="form-select"
                                value={doctorId}
                                onChange={(e) => setDoctorId(e.target.value)}
                                required
                            >
                                <option value="">Select Doctor</option>

                                {doctors.map((doctor) => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Time
                            </label>

                            <input
                                type="time"
                                className="form-control"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success"
                        >
                            Add Slot
                        </button>
                    </form>
                </div>
            )}

            {!loading && !error && slots.length === 0 && (
                <p>No appointment slots found.</p>
            )}

            {!loading && !error && slots.length > 0 && (
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                    </thead>

                    <tbody>
                    {slots.map((slot) => (
                        <tr key={slot.id}>
                            <td>{slot.id}</td>
                            <td>{slot.doctor_name}</td>
                            <td>{slot.date}</td>
                            <td>{slot.time}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminSlots;
