
import { useEffect, useState } from 'react';
import axios from 'axios';

function Booking() {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
const [message, setMessage] = useState('');
const [bookingId, setBookingId] = useState(null);

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

function handleBooking(slot) {
    const token = localStorage.getItem('token');

    if (!token) {
        setError('Please log in to book an appointment.');
        return;
    }

    setMessage('');
    setError('');
    setBookingId(slot.id);

    axios.post('/api/appointments/', {
        slot: slot.id
    }, {
        headers: {
            Authorization: 'Token ' + token
        }
    })
    .then((response) => {
        setMessage(
            'Appointment booked successfully! ' +
            slot.doctor_name + ' - ' +
            slot.date + ' ' + slot.time
        );

        setSlots((currentSlots) =>
            currentSlots.filter((item) => item.id !== slot.id)
        );
    })
    .catch((error) => {
        console.error(error);

        if (error.response?.status === 401) {
            setError('Your session has expired. Please log in again.');
        } else {
            const details = error.response?.data?.slot;

            setError(
                Array.isArray(details)
                    ? details.join(' ')
                    : 'Booking failed. Please try again.'
            );
        }
    })
    .finally(() => {
        setBookingId(null);
    });
}

    return (
        <div>
            <h2>Book an Appointment</h2>
            <p>Select an available appointment time.</p>

            {loading && (
                <p>Loading appointment slots...</p>
            )}

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
                      <th>Action</th>
                  </tr>
              </thead>

              <tbody>
                  {slots.map((slot) => (
                      <tr key={slot.id}>
                          <td>{slot.doctor_name}</td>
                          <td>{slot.date}</td>
                                <td>{slot.time}</td>
                          <td>
                              <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleBooking(slot)}
                                  disabled={bookingId !== null}
                              >
                                  {bookingId === slot.id
                                      ? 'Booking...'
                                      : 'Book'}
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
            )}
        </div>
    );
}
export default Booking;
