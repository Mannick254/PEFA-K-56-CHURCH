import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/hero.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <img src={logo} alt="Church Logo" className="navbar-logo" />
        PEFA Kawangware 56 Church
      </NavLink>
      <button className="navbar-toggle" onClick={toggleMenu}>
        <span className="hamburger"></span>
        <span className="hamburger"></span>
        <span className="hamburger"></span>
      </button>
      <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
        <NavLink to="/" exact activeClassName="active">Home</NavLink>
        <NavLink to="/about" activeClassName="active">About</NavLink>
        <NavLink to="/sermons" activeClassName="active">Sermons</NavLink>
        <NavLink to="/events" activeClassName="active">Events</NavLink>
        <NavLink to="/statement-of-faith" activeClassName="active">Statement of Faith</NavLink>
        <NavLink to="/prayers" activeClassName="active">Prayers</NavLink>
        <NavLink to="/contact" activeClassName="active">Contact</NavLink>
        <NavLink to="/login" activeClassName="active">Login</NavLink>
        <NavLink to="/register" activeClassName="active">Register</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
