
import { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('Please log in as an administrator.');
            setLoading(false);
            return;
        }

        axios.get('/api/admin/profile/', {
            headers: {
                Authorization: 'Token ' + token
            }
        })
        .then(() => {
            return axios.get('/api/doctors/');
        })
        .then((response) => {
            setDoctors(response.data);
        })
        .catch((error) => {
            console.error(error);
            setError('Access denied or failed to load doctors.');
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    return (
        <div>
            <h2>Manage Doctors</h2>

            {loading && <p>Loading doctors...</p>}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {!loading && !error && doctors.length === 0 && (
                <p>No doctors found.</p>
            )}

            {!loading && !error && doctors.length > 0 && (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Specialty</th>
                            <th>Bio</th>
                        </tr>
                    </thead>

                    <tbody>
                        {doctors.map((doctor) => (
                            <tr key={doctor.id}>
                                <td>{doctor.id}</td>
                                <td>{doctor.name}</td>
                                <td>{doctor.specialty}</td>
                                <td>{doctor.bio}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminDoctors;
