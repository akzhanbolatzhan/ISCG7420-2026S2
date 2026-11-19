
import {useEffect, useState} from 'react';
import axios from 'axios';

function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminAppointments;
