
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';

function App() {
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

                        <Link className="nav-link" to="/login">
                            Login
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
