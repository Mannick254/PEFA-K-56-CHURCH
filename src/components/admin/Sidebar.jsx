import React, { useState, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from '../../styles/Admin.module.css';
import {
  FaUsers, FaUserGraduate, FaChild, FaCalendarCheck, FaUserPlus, FaHome, FaBook,
  FaCalendarAlt, FaPray, FaFileAlt, FaHandHoldingHeart, FaInfoCircle, FaLandmark,
  FaBible, FaChurch, FaAngleLeft, FaAngleRight, FaSignOutAlt, FaChevronDown, FaDatabase,
  FaImage
} from 'react-icons/fa';
import useAuthStore from '../../store';

const NavGroup = ({ group, isCollapsed }) => {
  const location = useLocation();
  const isParentActive = group.links.some(link => location.pathname.includes(link.to));
  const [isOpen, setIsOpen] = useState(isParentActive);

  return (
    <div className={styles.navGroup}>
      <button onClick={() => setIsOpen(!isOpen)} className={`${styles.groupToggle} ${isParentActive ? styles.groupActive : ''}`}>
        <span className={styles.linkIcon}>{group.icon}</span>
        {!isCollapsed && <span className={styles.groupTitle}>{group.title}</span>}
        {!isCollapsed && <FaChevronDown className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />}
      </button>
      <div className={`${styles.submenu} ${isOpen && !isCollapsed ? styles.submenuOpen : ''}`}>
        {group.links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            title={link.label}
          >
            <span className={styles.linkIcon}>{link.icon}</span>
            {!isCollapsed && <span className={styles.linkLabel}>{link.label}</span>}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

const Sidebar = ({ isMobileView, isCollapsed, isMobileOpen, toggleSidebar, toggleMobileMenu }) => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navGroups = useMemo(() => [
    {
      title: "Internal Data",
      icon: <FaUsers />,
      links: [
        { to: "/admin/view-data", label: "View All Data", icon: <FaDatabase /> },
        { to: "/admin/members", label: "Church Members", icon: <FaUsers /> },
        { to: "/admin/youth", label: "Youth Department", icon: <FaUserGraduate /> },
        { to: "/admin/children", label: "Children's Ministry", icon: <FaChild /> },
        { to: "/admin/attendance", label: "Sunday Attendance", icon: <FaCalendarCheck /> },
        { to: "/admin/visitors", label: "New Visitors", icon: <FaUserPlus /> },
      ]
    },
    {
      title: "Public Publishing",
      icon: <FaHome />,
      links: [
        { to: "/admin/home-page", label: "Home Layout", icon: <FaHome /> },
        { to: "/admin/hero-admin", label: "Hero Admin", icon: <FaHome /> },
        { to: "/admin/sermons", label: "Sermon Library", icon: <FaBook /> },
        { to: "/admin/events", label: "Events Manager", icon: <FaCalendarAlt /> },
        { to: "/admin/prayers", label: "Prayer Wall", icon: <FaPray /> },
        { to: "/admin/statement-of-faith", label: "Faith Statement", icon: <FaFileAlt /> },
        { to: "/admin/kindness-acts", label: "Kindness Feed", icon: <FaHandHoldingHeart /> },
        { to: "/admin/k56-gallery", label: "K56 Gallery", icon: <FaImage /> },
      ]
    },
    {
      title: "Content Pages",
      icon: <FaInfoCircle />,
      links: [
        { to: "/admin/about-page", label: "About Section", icon: <FaInfoCircle /> },
        { to: "/admin/church-importance", label: "The Landmark", icon: <FaLandmark /> },
        { to: "/admin/jesus-lessons", label: "Biblical Lessons", icon: <FaBible /> },
        { to: "/admin/church-established", label: "Church Foundation", icon: <FaChurch /> },
      ]
    },
    {
      title: "Church Department",
      icon: <FaChurch />,
      links: [
        { to: "/admin/church-department", label: "Church Department", icon: <FaChurch /> },
      ]
    }
  ], []);

  const sidebarClasses = `
    ${styles.sidebar} 
    ${isMobileView ? (isMobileOpen ? styles.mobileVisible : '') : (isCollapsed ? styles.collapsed : '')}
  `;

  const buttonClasses = `
    ${styles.collapseBtn}
    ${isMobileView ? styles.mobileButtonOpen : (isCollapsed ? styles.buttonCollapsed : '')}
  `;

  const handleClick = isMobileView ? toggleMobileMenu : toggleSidebar;
  const icon = isMobileView ? (isMobileOpen ? <FaAngleLeft /> : <FaAngleRight />) : (isCollapsed ? <FaAngleRight /> : <FaAngleLeft />);

  return (
    <>
      <aside className={sidebarClasses}>
        <div className={styles.sidebarBrand}>
          <div className={styles.logoCircle}>P</div>
          {(!isCollapsed || isMobileOpen) && <span className={styles.brandName}>PEFA 56</span>}
        </div>

        <nav className={styles.navScrollable}>
          {navGroups.map((group, idx) => (
            <NavGroup key={idx} group={group} isCollapsed={isMobileView ? false : isCollapsed} />
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
           <button onClick={handleLogout} className={styles.logoutLink}>
              <FaSignOutAlt />
              {(!isCollapsed || isMobileOpen) && <span>Exit Dashboard</span>}
           </button>
        </div>
      </aside>
      <button className={buttonClasses} onClick={handleClick}>{icon}</button>
    </>
  );
};

export default Sidebar;
