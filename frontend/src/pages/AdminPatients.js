import {useEffect, useState} from 'react';
import axios from 'axios';

function AdminPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editUsername, setEditUsername] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [message, setMessage] = useState('');
    const [formError, setFormError] = useState('');

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
    useEffect(() => {
        if (editingId !== null) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [editingId]);

    function handleEditPatient(patient) {
        setEditingId(patient.id);
        setEditUsername(patient.username);
        setEditEmail(patient.email);

        setMessage('');
        setFormError('');
    }

    function handleUpdatePatient(event) {
        event.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
            setFormError('Please log in as an administrator.');
            return;
        }

        setMessage('');
        setFormError('');

        axios.patch('/api/admin/patients/' + editingId + '/', {
            username: editUsername,
            email: editEmail
        }, {
            headers: {
                Authorization: 'Token ' + token
            }
        })
            .then((response) => {
                setPatients((currentPatients) =>
                    currentPatients.map((patient) =>
                        patient.id === editingId
                            ? response.data
                            : patient
                    )
                );

                setMessage('Patient updated successfully!');
                setEditingId(null);
            })
            .catch((error) => {
                console.error(error);

                setFormError(
                    error.response?.data?.email?.[0] ||
                    error.response?.data?.username?.[0] ||
                    'Failed to update patient.'
                );
            });
    }

    return (
        <div>
            <h2>Manage Patients</h2>

            {loading && <p>Loading patients...</p>}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}
            {message && (
                <div className="alert alert-success">
                    {message}
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
                        <th>Action</th>
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

                            <td>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleEditPatient(patient)}
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
                    <h4>Edit Patient #{editingId}</h4>

                    <form onSubmit={handleUpdatePatient}>
                        <div className="mb-3">
                            <label className="form-label">
                                Username
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                value={editUsername}
                                onChange={(e) => setEditUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                className="form-control"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                required
                            />
                        </div>

                        {formError && (
                            <div className="alert alert-danger">
                                {formError}
                            </div>
                        )}

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

export default AdminPatients;
