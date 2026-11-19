import {useEffect, useState} from 'react';
import axios from 'axios';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Booking from './pages/Booking';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAppointments from './pages/MyAppointments';
import AdminDashboard from './pages/AdminDashboard';
import AdminDoctors from './pages/AdminDoctors';
import AdminSlots from './pages/AdminSlots';
import AdminAppointments from './pages/AdminAppointments';
import AdminPatients from './pages/AdminPatients';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem('token')
    );

    const [logoutError, setLogoutError] = useState('');
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        if (!isLoggedIn) {
            setIsAdmin(null);
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        axios.get('/api/auth/me/', {
            headers: {
                Authorization: 'Token ' + token
            }
        })
            .then((response) => {
                setIsAdmin(response.data.is_staff);
            })
            .catch((error) => {
                console.error(error);
                setIsAdmin(null);

                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                }
            });
    }, [isLoggedIn]);


    function handleLogout() {
        const token = localStorage.getItem('token');


        if (!token) {
            setIsLoggedIn(false);
            return;
        }

        axios.post('/api/auth/logout/', {}, {
            headers: {
                Authorization: 'Token ' + token
            }
        })
            .then(() => {
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                setLogoutError('');
            })
            .catch((error) => {
                console.error(error);

                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                    setLogoutError('');
                } else {
                    setLogoutError('Logout failed. Please try again.');
                }
            });
    }

    return (
        <BrowserRouter>
            <nav className="navbar navbar-expand-lg bg-light border-bottom">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        Piki Ora Medical Centre
                    </Link>

                    <div className="navbar-nav">
                        <Link className="nav-link" to="/">
                            Home
                        </Link>

                        <Link className="nav-link" to="/doctors">
                            Doctors
                        </Link>
                        {isLoggedIn && isAdmin === false && (
                            <Link className="nav-link" to="/booking">
                                Book Appointment
                            </Link>
                        )}
                        {isLoggedIn && isAdmin === false && (
                            <Link className="nav-link" to="/my-appointments">
                                My Appointments
                            </Link>
                        )}
                        {isLoggedIn && isAdmin === true && (
                            <Link className="nav-link" to="/admin-dashboard">
                                Admin Dashboard
                            </Link>
                        )}
                        {!isLoggedIn && (
                            <Link className="nav-link" to="/register">
                                Register
                            </Link>
                        )}
                        {isLoggedIn ? (
                            <button
                                className="btn btn-outline-danger"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        ) : (
                            <Link className="nav-link" to="/login">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                {logoutError && (
                    <div className="alert alert-danger">
                        {logoutError}
                    </div>
                )}

                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/doctors" element={<Doctors/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/booking" element={<Booking/>}/>
                    <Route path="/my-appointments" element={<MyAppointments/>}/>
                    <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
                    <Route path="/admin-doctors" element={<AdminDoctors/>}/>
                    <Route path="/admin-slots" element={<AdminSlots/>}/>
                    <Route path="/admin-appointments" element={<AdminAppointments/>}/>
                    <Route path="/admin-patients" element={<AdminPatients/>}/>
                    <Route
                        path="/login"
                        element={
                            <Login
                                onLogin={() => setIsLoggedIn(true)}
                            />
                        }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
