
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../styles/AcademyNavbar.module.css';

const AcademyNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => setScrolled(window.scrollY > 20);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeAll = useCallback(() => {
    setIsOpen(false);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/academy' },
    { name: 'About', path: '/academy/about' },
    { name: 'Admissions', path: '/academy/admissions' },
    { name: 'Academics', path: '/academy/academics' },
    { name: 'Contact', path: '/academy/contact' },
    { name: 'Visit Church', path: '/' },

  ];

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        <NavLink to="/academy" className={styles.navbarBrand} onClick={closeAll}>
        <div className={styles.logoWrapper}>
          <img src="https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png" alt="PEFA Fiftysix Academy" className={styles.logo} />
          </div>

          <div className={styles.brandText}>
            <span className={styles.brandMain}>PEFA FiftySix</span>
            <span className={styles.brandSub}>ACADEMY</span>
          </div>
        </NavLink>

        <button
          className={`${styles.menuToggle} ${isOpen ? styles.toggleActive : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        <nav className={`${styles.navMenu} ${isOpen ? styles.menuOpen : ''}`}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink to={link.path} className={styles.navLink} onClick={closeAll}>
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AcademyNavbar;
