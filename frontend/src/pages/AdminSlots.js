import {useEffect, useState} from 'react';
import axios from 'axios';

function AdminSlots() {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
            })
            .catch((error) => {
                console.error(error);
                setError('Failed to load appointment slots.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h2>Manage Appointment Slots</h2>

            {loading && <p>Loading appointment slots...</p>}

            {error && (
                <div className="alert alert-danger">
                    {error}
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
