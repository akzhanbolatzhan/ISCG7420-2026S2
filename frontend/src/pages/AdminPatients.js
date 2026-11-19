
import {useEffect, useState} from 'react';
import axios from 'axios';

function AdminPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('Please log in as an administrator.');
            setLoading(false);
            return;
        }

        axios.get('/api/admin/patients/', {
            headers: {
                Authorization: 'Token ' + token
            }
        })
            .then((response) => {
                setPatients(response.data);
            })
            .catch((error) => {
                console.error(error);
                setError('Access denied or failed to load patients.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h2>Manage Patients</h2>

            {loading && <p>Loading patients...</p>}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {!loading && !error && patients.length === 0 && (
                <p>No patients found.</p>
            )}

            {!loading && !error && patients.length > 0 && (
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Date Joined</th>
                    </tr>
                    </thead>

                    <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.id}>
                            <td>{patient.id}</td>
                            <td>{patient.username}</td>
                            <td>{patient.email}</td>
                            <td>
                                {patient.is_active ? 'Active' : 'Disabled'}
                            </td>
                            <td>{patient.date_joined}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminPatients;
