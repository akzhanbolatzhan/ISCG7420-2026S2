import {useEffect, useState} from 'react';
import axios from 'axios';

function AdminDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [name, setName] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [bio, setBio] = useState('');
    const [message, setMessage] = useState('');
    const [formError, setFormError] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editSpecialty, setEditSpecialty] = useState('');
    const [editBio, setEditBio] = useState('');


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



    useEffect(() => {
        if (editingId !== null) {
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [editingId]);

    function handleAddDoctor(event) {
        event.preventDefault();

        const token = localStorage.getItem('token');

        setMessage('');
        setFormError('');

        axios.post('/api/admin/doctors/', {
            name: name,
            specialty: specialty,
            bio: bio
        }, {
            headers: {
                Authorization: 'Token ' + token
            }
        })
            .then((response) => {
                setDoctors((currentDoctors) => [
                    ...currentDoctors,
                    response.data
                ]);

                setMessage('Doctor added successfully!');

                setName('');
                setSpecialty('');
                setBio('');
            })
            .catch((error) => {
                console.error(error);
                setFormError('Failed to add doctor.');
            });
    }


    function handleEditDoctor(doctor) {
        setEditingId(doctor.id);
        setEditName(doctor.name);
        setEditSpecialty(doctor.specialty);
        setEditBio(doctor.bio || '');

        setMessage('');
        setFormError('');
    }


    function handleUpdateDoctor(event) {
        event.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
            setFormError('Please log in as an administrator.');
            return;
        }

        setMessage('');
        setFormError('');

        axios.patch('/api/admin/doctors/' + editingId + '/', {
            name: editName,
            specialty: editSpecialty,
            bio: editBio
        }, {
            headers: {
                Authorization: 'Token ' + token
            }
        })
            .then((response) => {
                setDoctors((currentDoctors) =>
                    currentDoctors.map((doctor) =>
                        doctor.id === editingId
                            ? response.data
                            : doctor
                    )
                );

                setMessage('Doctor updated successfully!');
                setEditingId(null);
            })
            .catch((error) => {
                console.error(error);
                setFormError('Failed to update doctor.');
            });
    }

    function handleDeleteDoctor(doctor) {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete ' + doctor.name + '?'
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

        axios.delete('/api/admin/doctors/' + doctor.id + '/', {
            headers: {
                Authorization: 'Token ' + token
            }
        })
            .then((response) => {
                setDoctors((currentDoctors) =>
                    currentDoctors.filter(
                        (item) => item.id !== doctor.id
                    )
                );

                if (editingId === doctor.id) {
                    setEditingId(null);
                }

                setMessage('Doctor deleted successfully!');
            })
            .catch((error) => {
                console.error(error);

                const errorMessage = error.response?.data?.detail;

                setFormError(
                    errorMessage || 'Failed to delete doctor.'
                );
            });
    }

    return (
        <div>
            <h2>Manage Doctors</h2>

            {loading && <p>Loading doctors...</p>}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}


            {!loading && !error && (
                <div className="mb-4">
                    <h4>Add New Doctor</h4>

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

                    <form onSubmit={handleAddDoctor}>
                        <div className="mb-3">
                            <label className="form-label">
                                Doctor Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Specialty
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={specialty}
                                onChange={(e) => setSpecialty(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Bio
                            </label>
                            <textarea
                                className="form-control"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows="3"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success"
                        >
                            Add Doctor
                        </button>
                    </form>
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
                        <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {doctors.map((doctor) => (
                        <tr key={doctor.id}>
                            <td>{doctor.id}</td>
                            <td>{doctor.name}</td>
                            <td>{doctor.specialty}</td>
                            <td>{doctor.bio}</td>

                            <td className="text-nowrap">
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleEditDoctor(doctor)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger btn-sm ms-2"
                                    onClick={() => handleDeleteDoctor(doctor)}
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
                    <h4>Edit Doctor #{editingId}</h4>

                    <form onSubmit={handleUpdateDoctor}>
                        <div className="mb-3">
                            <label className="form-label">
                                Doctor Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Specialty
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={editSpecialty}
                                onChange={(e) => setEditSpecialty(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                Bio
                            </label>
                            <textarea
                                className="form-control"
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                                rows="3"
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

export default AdminDoctors;
