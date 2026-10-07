import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaUser, FaRadio } from 'react-icons/fa6';
import { FiX, FiMenu, FiLogOut, FiUserCheck, FiGrid } from 'react-icons/fi';
import styles from '../styles/Navbar.module.css';
import useAuthStore from '../store';
import SermonHoverCard from './SermonHoverCard'; // Import the new component

const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isSermonLinkHovered, setIsSermonLinkHovered] = useState(false);

  const navRef = useRef(null);

  // Handle Header Scroll Effects
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeAll = useCallback(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, []);

  // Toggle dropdowns reliably across desktop & mobile touch
  const toggleDropdown = (name, e) => {
    e.stopPropagation();
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Close menus on Outside Click or Escape Keypress
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeAll();
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeAll();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [closeAll]);

  const handleLogout = async () => {
    await signOut();
    closeAll();
    navigate('/');
  };

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`} ref={navRef}>
      {/* Top Editorial Ticker Bar */}
      <div className={styles.topAccentBar}>
        <div className={styles.topBarInner}>
          <NavLink to="/live" className={styles.liveBroadcastTag} onClick={closeAll}>
            <FaRadio className={styles.liveIcon} />
            <span>PEFA K-56 LIVE BROADCAST</span>
          </NavLink>
          <span className={styles.tagline}>Nairobi, Kenya</span>
        </div>
      </div>

      <div className={styles.navContainer}>
        {/* Brand Logo */}
        <NavLink to="/" className={styles.navbarBrand} onClick={closeAll} title="Homepage">
          <div className={styles.logoWrapper}>
            <img 
              src="https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png" 
              alt="PEFA KAWANGWARE 56 CHURCH" 
              className={styles.logo} 
            />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandMain}>PEFA KAWANGWARE</span>
            <span className={styles.brandSub}>56 CHURCH</span>
          </div>
        </NavLink>

        {/* Mobile Menu Toggle Button */}
        <button
          className={styles.mobileToggleBtn}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Navigation Menu Grid */}
        <nav className={`${styles.navMenu} ${isMobileMenuOpen ? styles.menuOpen : ''}`}>
          <ul className={styles.navList}>
            
            {/* Direct Links */}
            <li>
              <NavLink to="/" className={styles.navLink} onClick={closeAll}>Home</NavLink>
            </li>
            <li>
              <NavLink to="/live" className={`${styles.navLink} ${styles.liveNavLink}`} onClick={closeAll}>
                Live Service
              </NavLink>
            </li>

            {/* Resources Dropdown */}
            <li 
              className={styles.navItem} 
              onMouseEnter={() => window.innerWidth > 900 && setActiveDropdown('resources')}
              onMouseLeave={() => window.innerWidth > 900 && setActiveDropdown(null)}
            >
              <button
                className={`${styles.dropBtn} ${activeDropdown === 'resources' ? styles.activeBtn : ''}`}
                onClick={(e) => toggleDropdown('resources', e)}
                aria-expanded={activeDropdown === 'resources'}
              >
                Resources <FaChevronDown className={`${styles.arrow} ${activeDropdown === 'resources' ? styles.rotate : ''}`} />
              </button>
              <div className={`${styles.dropdownContent} ${activeDropdown === 'resources' ? styles.show : ''}`}>
                <div 
                  className={styles.sermonLinkContainer}
                  onMouseEnter={() => setIsSermonLinkHovered(true)}
                  onMouseLeave={() => setIsSermonLinkHovered(false)}
                >
                    <NavLink to="/sermons" onClick={closeAll}>Sermons Archive</NavLink>
                    {isSermonLinkHovered && (
                        <div className={styles.sermonHoverContainer}>
                            <SermonHoverCard />
                        </div>
                    )}
                </div>
                <NavLink to="/blog" onClick={closeAll}>News & Blog</NavLink>
                <NavLink to="/events" onClick={closeAll}>Events Calendar</NavLink>
                <NavLink to="/church-data" onClick={closeAll}>Church Data</NavLink>
				<NavLink to="/lyrics-studio" onClick={closeAll}>Lyrics Studio</NavLink>
              </div>
            </li>

            {/* Connect Dropdown */}
            <li 
              className={styles.navItem}
              onMouseEnter={() => window.innerWidth > 900 && setActiveDropdown('connect')}
              onMouseLeave={() => window.innerWidth > 900 && setActiveDropdown(null)}
            >
              <button
                className={`${styles.dropBtn} ${activeDropdown === 'connect' ? styles.activeBtn : ''}`}
                onClick={(e) => toggleDropdown('connect', e)}
                aria-expanded={activeDropdown === 'connect'}
              >
                Connect <FaChevronDown className={`${styles.arrow} ${activeDropdown === 'connect' ? styles.rotate : ''}`} />
              </button>
              <div className={`${styles.dropdownContent} ${activeDropdown === 'connect' ? styles.show : ''}`}>
                <NavLink to="/give" onClick={closeAll}>Give / Support</NavLink>
                <NavLink to="/church-department" onClick={closeAll}>Departments & Ministries</NavLink>
                <NavLink to="/academy" onClick={closeAll}>K56 Academy</NavLink>
              </div>
            </li>

            {/* About Dropdown */}
            <li 
              className={styles.navItem}
              onMouseEnter={() => window.innerWidth > 900 && setActiveDropdown('about')}
              onMouseLeave={() => window.innerWidth > 900 && setActiveDropdown(null)}
            >
              <button
                className={`${styles.dropBtn} ${activeDropdown === 'about' ? styles.activeBtn : ''}`}
                onClick={(e) => toggleDropdown('about', e)}
                aria-expanded={activeDropdown === 'about'}
              >
                About <FaChevronDown className={`${styles.arrow} ${activeDropdown === 'about' ? styles.rotate : ''}`} />
              </button>
              <div className={`${styles.dropdownContent} ${activeDropdown === 'about' ? styles.show : ''}`}>
                <NavLink to="/about" onClick={closeAll}>Our Story</NavLink>
                <NavLink to="/statement-of-faith" onClick={closeAll}>What We Believe</NavLink>
                <NavLink to="/prayers" onClick={closeAll}>Prayer Altar</NavLink>
                <NavLink to="/contact" onClick={closeAll}>Contact Us</NavLink>
              </div>
            </li>

            {/* Auth / Profile Area */}
            {user ? (
              <li 
                className={styles.navItem}
                onMouseEnter={() => window.innerWidth > 900 && setActiveDropdown('profile')}
                onMouseLeave={() => window.innerWidth > 900 && setActiveDropdown(null)}
              >
                <button
                  className={`${styles.dropBtn} ${styles.profileBtn} ${activeDropdown === 'profile' ? styles.activeBtn : ''}`}
                  onClick={(e) => toggleDropdown('profile', e)}
                  aria-expanded={activeDropdown === 'profile'}
                >
                  <FaUser size={14} /> 
                  <span className={styles.profileBtnText}>Account</span>
                  <FaChevronDown className={`${styles.arrow} ${activeDropdown === 'profile' ? styles.rotate : ''}`} />
                </button>
                <div className={`${styles.dropdownContent} ${activeDropdown === 'profile' ? styles.show : ''}`}>
                  <NavLink to="/profile" onClick={closeAll} className={styles.profileLink}>
                    <FiUserCheck size={14} /> Profile
                  </NavLink>
                  {user.is_admin && (
                    <NavLink to="/admin" onClick={closeAll} className={styles.profileLink}>
                      <FiGrid size={14} /> Admin Dashboard
                    </NavLink>
                  )}
                  <button onClick={handleLogout} className={styles.logoutBtn}>
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              </li>
            ) : (
              <li 
                className={styles.navItem}
                onMouseEnter={() => window.innerWidth > 900 && setActiveDropdown('auth')}
                onMouseLeave={() => window.innerWidth > 900 && setActive.dropdown(null)}
              >
                <button
                  className={`${styles.dropBtn} ${styles.loginBtn} ${activeDropdown === 'auth' ? styles.activeBtn : ''}`}
                  onClick={(e) => toggleDropdown('auth', e)}
                  aria-expanded={activeDropdown === 'auth'}
                >
                  Login <FaChevronDown className={`${styles.arrow} ${activeDropdown === 'auth' ? styles.rotate : ''}`} />
                </button>
                <div className={`${styles.dropdownContent} ${activeDropdown === 'auth' ? styles.show : ''}`}>
                  <NavLink to="/login" onClick={closeAll}>Member Login</NavLink>
                  <NavLink to="/admin-login" onClick={closeAll}>Admin Portal</NavLink>
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