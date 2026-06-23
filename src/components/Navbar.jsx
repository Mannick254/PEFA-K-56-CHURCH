
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaUser } from 'react-icons/fa';
import styles from '../styles/Navbar.module.css';
import useAuthStore from '../store'; // Import the Zustand store

const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutDropdownActive, setAboutDropdownActive] = useState(false);
  const [isLoginDropdownActive, setLoginDropdownActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const aboutDropdownRef = useRef(null);
  const loginDropdownRef = useRef(null);

  const handleScroll = () => setScrolled(window.scrollY > 20);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeAll = useCallback(() => {
    setIsOpen(false);
    setAboutDropdownActive(false);
    setLoginDropdownActive(false);
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target)) {
      setAboutDropdownActive(false);
    }
    if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target)) {
      setLoginDropdownActive(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') closeAll(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeAll]);

  const handleLogout = async () => {
    await signOut();
    navigate('/'); // Redirect to home page after logout
    closeAll();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Sermons', path: '/sermons' },
    { name: 'Events', path: '/events' },
    { name: 'Faith', path: '/statement-of-faith' },
    { name: 'Prayers', path: '/prayers' },
    { name: 'Church Department', path: '/church-department' },
  ];

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        <NavLink to="/" className={styles.navbarBrand} onClick={closeAll}>
        <div className={styles.logoWrapper}>
          <img src="https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png" alt="PEFA KAWANGWARE 56 CHURCH" className={styles.logo} />
          </div>

          <div className={styles.brandText}>
            <span className={styles.brandMain}>PEFA KAWANGWARE</span>
            <span className={styles.brandSub}>56 CHURCH</span>
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

            <li className={styles.navItem} ref={aboutDropdownRef}>
              <button
                className={styles.dropBtn}
                onClick={() => setAboutDropdownActive(!isAboutDropdownActive)}
                aria-haspopup="true"
                aria-expanded={isAboutDropdownActive}
              >
                About <FaChevronDown className={`${styles.arrow} ${isAboutDropdownActive ? styles.rotate : ''}`} />
              </button>
              <div className={`${styles.dropdownContent} ${isAboutDropdownActive ? styles.show : ''}`}>
                <NavLink to="/about" onClick={closeAll}>About Us</NavLink>
                <NavLink to="/contact" onClick={closeAll}>Contact</NavLink>
              </div>
            </li>

            {user ? (
              <li className={styles.navItem} ref={loginDropdownRef}>
                <button
                  className={`${styles.dropBtn} ${styles.profileBtn}`}
                  onClick={() => setLoginDropdownActive(!isLoginDropdownActive)}
                  aria-haspopup="true"
                  aria-expanded={isLoginDropdownActive}
                >
                  <FaUser /> <FaChevronDown className={`${styles.arrow} ${isLoginDropdownActive ? styles.rotate : ''}`} />
                </button>
                <div className={`${styles.dropdownContent} ${isLoginDropdownActive ? styles.show : ''}`}>
                  <NavLink to="/profile" onClick={closeAll}>Profile</NavLink>
                  <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
                </div>
              </li>
            ) : (
              <li className={styles.navItem} ref={loginDropdownRef}>
                <button
                  className={styles.dropBtn}
                  onClick={() => setLoginDropdownActive(!isLoginDropdownActive)}
                  aria-haspopup="true"
                  aria-expanded={isLoginDropdownActive}
                >
                  Login <FaChevronDown className={`${styles.arrow} ${isLoginDropdownActive ? styles.rotate : ''}`} />
                </button>
                <div className={`${styles.dropdownContent} ${isLoginDropdownActive ? styles.show : ''}`}>
                  <NavLink to="/login" onClick={closeAll}>User</NavLink>
                  <NavLink to="/admin-login" onClick={closeAll}>Admin</NavLink>
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
