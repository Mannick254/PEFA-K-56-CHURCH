import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../../styles/AdminNavbar.module.css';
import {
  FaUsers, FaUserGraduate, FaChild, FaCalendarCheck, FaUserPlus, FaHome, FaBook,
  FaCalendarAlt, FaPray, FaFileAlt, FaHandHoldingHeart, FaInfoCircle, FaLandmark,
  FaBible, FaChurch, FaSignOutAlt, FaChevronDown, FaDatabase,
  FaImage, FaVideo
} from 'react-icons/fa';
import useAuthStore from '../../store';

const NavGroup = ({ group, closeMenu, isMobile, onToggle, isOpen }) => {

  const handleLinkClick = () => {
    if (isMobile) {
      closeMenu();
    }
  };

  return (
    <div className={`${styles.navGroup} ${isMobile && isOpen ? styles.mobileOpen : ''}`}>
      <button className={styles.groupToggle} onClick={isMobile ? onToggle : undefined}>
        {group.icon}
        <span className={styles.groupTitle}>{group.title}</span>
        <FaChevronDown className={styles.chevron} />
      </button>
      <div className={styles.dropdown}>
        {group.links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            onClick={handleLinkClick}
          >
            {link.icon}
            <span className={styles.linkLabel}>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

const AdminNavbar = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const navRef = useRef(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setOpenMobileGroup(null);
  }, []);

  const handleScroll = () => setScrolled(window.scrollY > 20);
  const checkIsMobile = () => setIsMobile(window.innerWidth <= 992);

  const handleClickOutside = useCallback((event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      closeMenu();
    }
  }, [closeMenu]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkIsMobile);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', checkIsMobile);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') closeMenu(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeMenu]);


  const handleLogout = async () => {
    await signOut();
    navigate('/');
    closeMenu();
  };

  const toggleMobileGroup = (index) => {
    setOpenMobileGroup(openMobileGroup === index ? null : index);
  };


  const navGroups = useMemo(() => [
    {
        title: "Live Stream",
        icon: <FaVideo />,
        links: [
            { to: "/admin/live", label: "Live", icon: <FaVideo /> },
        ]
    },
    {
      title: "Internal Data",
      icon: <FaUsers />,
      links: [
        { to: "/admin/view-data", label: "All Data", icon: <FaDatabase /> },
        { to: "/admin/members", label: "Members", icon: <FaUsers /> },
        { to: "/admin/youth", label: "Youth", icon: <FaUserGraduate /> },
        { to: "/admin/children", label: "Children", icon: <FaChild /> },
        { to: "/admin/attendance", label: "Attendance", icon: <FaCalendarCheck /> },
        { to: "/admin/visitors", label: "Visitors", icon: <FaUserPlus /> },
        { to: "/admin/connect", label: "Connect", icon: <FaUserPlus /> },
      ]
    },
    {
      title: "Public Publishing",
      icon: <FaHome />,
      links: [
        { to: "/admin/home-page", label: "Home", icon: <FaHome /> },
        { to: "/admin/hero-admin", label: "Hero", icon: <FaHome /> },
        { to: "/admin/sermons", label: "Sermons", icon: <FaBook /> },
        { to: "/admin/blog", label: "Blog", icon: <FaBook /> },
        { to: "/admin/events", label: "Events", icon: <FaCalendarAlt /> },
        { to: "/admin/prayers", label: "Prayers", icon: <FaPray /> },
        { to: "/admin/statement-of-faith", label: "Faith", icon: <FaFileAlt /> },
        { to: "/admin/kindness-acts", label: "Kindness", icon: <FaHandHoldingHeart /> },
        { to: "/admin/k56-gallery", label: "Gallery", icon: <FaImage /> },
      ]
    },
    {
      title: "Content Pages",
      icon: <FaInfoCircle />,
      links: [
        { to: "/admin/about-page", label: "About", icon: <FaInfoCircle /> },
        { to: "/admin/church-importance", label: "Landmark", icon: <FaLandmark /> },
        { to: "/admin/jesus-lessons", label: "Lessons", icon: <FaBible /> },
        { to: "/admin/church-established", label: "Foundation", icon: <FaChurch /> },
      ]
    },
    {
      title: "Church Department",
      icon: <FaChurch />,
      links: [
        { to: "/admin/church-department", label: "Department", icon: <FaChurch /> },
      ]
    }
  ], []);

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        <NavLink to="/admin" className={styles.navbarBrand} onClick={closeMenu}>
          <div className={styles.logoWrapper}>
            <img src="https://res.cloudinary.com/dtcb3ffnv/image/upload/v1780723691/Untitled-design-24-_lfef05.png" alt="PEFA Fiftysix Admin" className={styles.logo} />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandMain}>PEFA FiftySix</span>
            <span className={styles.brandSub}>ADMIN</span>
          </div>
        </NavLink>

        <button
          className={`${styles.menuToggle} ${isMenuOpen ? styles.toggleActive : ''}`}
          onClick={() => setMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
          aria-expanded={isMenuOpen}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        <nav className={`${styles.navMenu} ${isMenuOpen ? styles.menuOpen : ''}`} ref={navRef}>
          <div className={styles.navLinks}>
            {navGroups.map((group, idx) => (
               <NavGroup 
                    key={idx} 
                    group={group} 
                    closeMenu={closeMenu} 
                    isMobile={isMobile}
                    isOpen={openMobileGroup === idx}
                    onToggle={() => toggleMobileGroup(idx)}
                />
            ))}
            <div className={styles.navGroup}>
               <button onClick={handleLogout} className={styles.logoutButton}>
                  <FaSignOutAlt />
                  <span>Exit Dashboard</span>
               </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AdminNavbar;
