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
    const [editingId, setEditingId] = useState(null);
    const [editDoctorId, setEditDoctorId] = useState('');
    const [editDate, setEditDate] = useState('');
    const [editTime, setEditTime] = useState('');

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
    useEffect(() => {
        if (editingId !== null) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [editingId]);

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

    function handleEditSlot(slot) {
        setEditingId(slot.id);
        setEditDoctorId(String(slot.doctor));
        setEditDate(slot.date);
        setEditTime(slot.time.slice(0, 5));

        setMessage('');
        setFormError('');
    }

    function handleUpdateSlot(event) {
        event.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
            setFormError('Please log in as an administrator.');
            return;
        }

        setMessage('');
        setFormError('');

        axios.patch('/api/admin/appointment-slots/' + editingId + '/', {
            doctor: Number(editDoctorId),
            date: editDate,
            time: editTime
        }, {
            headers: {
                Authorization: 'Token ' + token
            }
        })
            .then((response) => {
                setSlots((currentSlots) =>
                    currentSlots.map((slot) =>
                        slot.id === editingId
                            ? response.data
                            : slot
                    )
                );

                setMessage('Appointment slot updated successfully!');
                setEditingId(null);
            })
            .catch((error) => {
                console.error(error);

                setFormError(
                    error.response?.data?.detail ||
                    'Failed to update appointment slot.'
                );
            });
    }

    function handleDeleteSlot(slot) {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete appointment slot #' + slot.id + '?'
        );

        if (!confirmDelete) {
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            setFormError('Please log in as an administrator.');
            return;
        }

        setMessage('');
        setFormError('');

        axios.delete('/api/admin/appointment-slots/' + slot.id + '/', {
            headers: {
                Authorization: 'Token ' + token
            }
        })
            .then(() => {
                setSlots((currentSlots) =>
                    currentSlots.filter(
                        (item) => item.id !== slot.id
                    )
                );

                if (editingId === slot.id) {
                    setEditingId(null);
                }

                setMessage('Appointment slot deleted successfully!');
            })
            .catch((error) => {
                console.error(error);

                setFormError(
                    error.response?.data?.detail ||
                    'Failed to delete appointment slot.'
                );
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
                        <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {slots.map((slot) => (
                        <tr key={slot.id}>
                            <td>{slot.id}</td>
                            <td>{slot.doctor_name}</td>
                            <td>{slot.date}</td>
                            <td>{slot.time}</td>


                            <td className="text-nowrap">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleEditSlot(slot)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger btn-sm ms-2"
                                    onClick={() => handleDeleteSlot(slot)}
                                >
                                    Delete
                                </button>
                            </td>


                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {editingId !== null && (
                <div className="mt-4 mb-4">
                    <h4>Edit Appointment Slot #{editingId}</h4>

                    <form onSubmit={handleUpdateSlot}>
                        <div className="mb-3">
                            <label className="form-label">
                                Doctor
                            </label>

                            <select
                                className="form-select"
                                value={editDoctorId}
                                onChange={(e) => setEditDoctorId(e.target.value)}
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
                                value={editDate}
                                onChange={(e) => setEditDate(e.target.value)}
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
                                value={editTime}
                                onChange={(e) => setEditTime(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success me-2"
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

export default AdminSlots;
