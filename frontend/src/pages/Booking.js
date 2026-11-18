
import { useEffect, useState } from 'react';
import axios from 'axios';

function Booking() {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('/api/appointment-slots/')
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
            <h2>Book an Appointment</h2>
            <p>Select an available appointment time.</p>

            {loading && <p>Loading appointment slots...</p>}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {!loading && !error && slots.length === 0 && (
                <p>No available appointment slots.</p>
            )}

            {!loading && !error && slots.length > 0 && (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>

                    <tbody>
                        {slots.map((slot) => (
                            <tr key={slot.id}>
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

export default Booking;
