import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import styles from '../styles/Navbar.module.css';
import logo from '../assets/hero.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownActive, setDropdownActive] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Close the dropdown when the main menu is toggled
    if (isOpen) {
      setDropdownActive(false);
    }
  };

  const closeAllMenus = () => {
    setIsOpen(false);
    setDropdownActive(false);
  };

  const handleDropdownClick = (e) => {
    // Check if in mobile view (consistent with CSS media query)
    if (window.innerWidth <= 768) {
      e.preventDefault();
      setDropdownActive(prevState => !prevState);
    } else {
      // Default NavLink behavior on desktop, just close menus
      closeAllMenus();
    }
  };

  return (
    <nav className={styles.navbar}>
      <NavLink to="/" className={styles.navbarBrand} onClick={closeAllMenus}>
        <img src={logo} alt="Church Logo" className={styles.navbarLogo} />
        PEFA Kawangware 56 Church
      </NavLink>
      <button className={styles.navbarToggle} onClick={toggleMenu}>
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
        <span className={styles.hamburger}></span>
      </button>
      <div className={`${styles.navbarLinks} ${isOpen ? styles.active : ''}`}>
        <div className={`${styles.dropdown} ${isDropdownActive ? styles.active : ''}`}>
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => (isActive && !isDropdownActive ? styles.active : '')}
            onClick={handleDropdownClick}
          >
            Home <span className={styles.arrowDown}>&#9662;</span>
          </NavLink>
          <div className={styles.dropdownContent}>
            <NavLink to="/about" className={({ isActive }) => (isActive ? styles.active : '')} onClick={closeAllMenus}>About</NavLink>
            <NavLink to="/contact" className={({ isActive }) => (isActive ? styles.active : '')} onClick={closeAllMenus}>Contact</NavLink>
          </div>
        </div>
        <NavLink to="/sermons" className={({ isActive }) => (isActive ? styles.active : '')} onClick={closeAllMenus}>Sermons</NavLink>
        <NavLink to="/events" className={({ isActive }) => (isActive ? styles.active : '')} onClick={closeAllMenus}>Events</NavLink>
        <NavLink to="/statement-of-faith" className={({ isActive }) => (isActive ? styles.active : '')} onClick={closeAllMenus}>Statement of Faith</NavLink>
        <NavLink to="/prayers" className={({ isActive }) => (isActive ? styles.active : '')} onClick={closeAllMenus}>Prayers</NavLink>
        <ProfileIcon closeMenu={closeAllMenus} />
      </div>
    </nav>
  );
}

export default Navbar;
