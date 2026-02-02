import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Hide navbar on dashboard routes
    if (location.pathname.startsWith('/dashboard')) {
        return null;
    }

    return (
        <nav className="navbar glass">
            <div className="container nav-content">
                <Link to="/" className="logo-container">
                    <img src={logo} alt="EP INTWALI" className="logo-img" />
                    <div className="logo-text">
                        <h1 className="school-name">ECOLE PRIMAIRE INTWALI</h1>
                        <p className="school-motto">INDASHYIKIRWA</p>
                        <p className="school-values">UBURERE • UBUMENYI • UBUTWARI</p>
                    </div>
                </Link>

                <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <NavLink to="/" end onClick={() => setIsOpen(false)}>Home</NavLink>
                    <NavLink to="/about" onClick={() => setIsOpen(false)}>About Us</NavLink>
                    <NavLink to="/staff" onClick={() => setIsOpen(false)}>Staff</NavLink>
                    <NavLink to="/news" onClick={() => setIsOpen(false)}>News</NavLink>
                    <NavLink to="/contact" onClick={() => setIsOpen(false)}>Contact</NavLink>
                    <Link to="/login" className="btn btn-primary login-btn" onClick={() => setIsOpen(false)}>Login</Link>
                </div>

                <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
                    <span className={`bar ${isOpen ? 'active' : ''}`}></span>
                    <span className={`bar ${isOpen ? 'active' : ''}`}></span>
                    <span className={`bar ${isOpen ? 'active' : ''}`}></span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
