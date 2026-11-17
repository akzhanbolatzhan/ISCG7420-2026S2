
import { useEffect, useState } from 'react';
import axios from 'axios';

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('/api/doctors/')
            .then((response) => {
                setDoctors(response.data);
            })
            .catch((error) => {
                console.error(error);
                setError('Failed to load doctors.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <h2>Our Doctors</h2>
            <p>Meet our medical professionals.</p>

            {loading && <p>Loading doctors...</p>}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {!loading && !error && doctors.length === 0 && (
                <p>No doctors available.</p>
            )}

            <div className="row">
                {doctors.map((doctor) => (
                    <div className="col-md-4 mb-4" key={doctor.id}>
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title">
                                    {doctor.name}
                                </h5>

                                <h6 className="card-subtitle mb-2 text-muted">
                                    {doctor.specialty}
                                </h6>

                                <p className="card-text">
                                    {doctor.bio}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Doctors;
