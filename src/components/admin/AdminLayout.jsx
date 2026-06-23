import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from '../../styles/Admin.module.css';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 768;
      setIsMobileView(mobileView);
      // If we switch to desktop view, close the mobile menu
      if (!mobileView) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Call handler right away so state is set initial
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Prevent scrolling when mobile menu is open
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileOpen]);

  // Close mobile menu on page navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

  return (
    <div className={styles.adminLayout}>
      <Sidebar 
        isMobileView={isMobileView}
        isCollapsed={isCollapsed} 
        isMobileOpen={isMobileOpen} 
        toggleSidebar={toggleSidebar} 
        toggleMobileMenu={toggleMobileMenu} 
      />
      {isMobileOpen && <div className={styles.overlay} onClick={toggleMobileMenu} />}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;