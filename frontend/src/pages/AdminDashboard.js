import {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

function AdminDashboard() {
    const [admin, setAdmin] = useState(null);
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
            .then((response) => {
                setAdmin(response.data);
            })
            .catch((error) => {
                console.error(error);
                setError('Access denied. Administrator account required.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h2>Admin Dashboard</h2>

            {loading && <p>Checking administrator access...</p>}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {admin && (
                <div>
                    <p>Welcome, {admin.username}!</p>

                    <h4>Management</h4>

                    <ul className="list-group">
                        <li className="list-group-item">
                            <Link to="/admin-doctors">
                                Manage Doctors
                            </Link>
                        </li>
                        <li className="list-group-item">
                            <Link to="/admin-slots">
                                Manage Appointment Slots
                            </Link>
                        </li>
                        <li className="list-group-item">
                            <Link to="/admin-appointments">
                                Manage Appointments
                            </Link>
                        </li>
                        <li className="list-group-item">
                            <Link to="/admin-patients">
                                Manage Patients
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
