
import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(event) {
        event.preventDefault();

        setMessage('');
        setError('');

        axios.post('/api/auth/login/', {
            username: username,
            password: password
        })
         .then((response) => {
         localStorage.setItem('token', response.data.token)
          onLogin();
          setMessage('Login successful!');
          setPassword('');
          })
        .catch((error) => {
            console.error(error);
            setError('Invalid username or password.');
        });
    }

    return (
        <div className="col-md-5 mx-auto">
            <h2>Patient Login</h2>

            {message && (
                <div className="alert alert-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
