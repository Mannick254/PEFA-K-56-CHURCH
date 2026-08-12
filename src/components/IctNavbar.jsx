import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../styles/IctNavbar.module.css';
import logo from '../assets/PEFA56.svg';

const IctNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect with passive listener for performance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const navLinks = [
    { name: 'About', path: '/ict-team/About' },
    { name: 'Services', path: '/ict-team/Services' },
    { name: 'Projects', path: '/ict-team/Projects' },
  ];

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        {/* Brand / Logo */}
        <Link to="/ict-team" className={styles.navbarBrand} onClick={closeMenu}>
          <img src={logo} alt="PEFAK56 Logo" className={styles.logo} />
          <div className={styles.brandText}>
            <span className={styles.brandMain}>PEFAK56</span>
            <span className={styles.brandSub}>ICT TEAM</span>
          </div>
        </Link>

        {/* Modern Mobile Hamburger Button */}
        <button
          className={`${styles.menuToggle} ${isOpen ? styles.toggleActive : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle Navigation Menu"
          aria-expanded={isOpen}
          aria-controls="mobile-nav-menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        {/* Navigation Menu */}
        <nav
          id="mobile-nav-menu"
          className={`${styles.navMenu} ${isOpen ? styles.menuOpen : ''}`}
        >
          <ul className={styles.navList}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                    onClick={closeMenu}
                  >
                    {link.name}
                    {isActive && <span className={styles.activeIndicator} />}
                  </Link>
                </li>
              );
            })}
            <li className={styles.ctaWrapper}>
              <Link
                to="/ict-team/Contact"
                className={styles.ctaButton}
                onClick={closeMenu}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default IctNavbar;