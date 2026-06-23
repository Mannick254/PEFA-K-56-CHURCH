import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styles from '../styles/Sitemap.module.css';

// Public routes only
const mainRoutes = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About Us' },
  { path: '/sermons', name: 'Sermons' },
  { path: '/events', name: 'Events' },
  { path: '/church-department', name: 'Church Departments' },
  { path: '/statement-of-faith', name: 'Statement of Faith' },
  { path: '/prayers', name: 'Prayers' },
  { path: '/contact', name: 'Contact' },
];

const authRoutes = [
  { path: '/login', name: 'Login' },
  { path: '/register', name: 'Register' },
  { path: '/profile', name: 'User Profile' },
  { path: '/forgot-password', name: 'Forgot Password' },
];

const renderLinks = (routes) =>
  routes.map((route) => (
    <li key={route.path} className={styles.linkItem}>
      <Link to={route.path}>{route.name}</Link>
    </li>
  ));

const Sitemap = ({ isAdmin }) => {
  return (
    <>
      <Helmet>
        <title>Sitemap - PEFA Kawangware</title>
        <meta
          name="description"
          content="A complete overview of the PEFA Kawangware website structure, helping you find any page you need."
        />
        <link
          rel="canonical"
          href="https://pefa-kawangware-56-church.vercel.app/sitemap"
        />
      </Helmet>
      <div className={styles.sitemapContainer}>
        <div className={styles.header}>
          <h1>Sitemap</h1>
          <p>A complete overview of our website's structure.</p>
        </div>

        <div className={styles.sitemapGrid}>
          <div className={styles.column}>
            <h2 className={styles.columnTitle}>Main Pages</h2>
            <ul className={styles.linkList}>{renderLinks(mainRoutes)}</ul>
          </div>

          <div className={styles.column}>
            <h2 className={styles.columnTitle}>User Accounts</h2>
            <ul className={styles.linkList}>{renderLinks(authRoutes)}</ul>
          </div>

          {/* ✅ Admin links only shown if user is authenticated as admin */}
          {isAdmin && (
            <div className={styles.column}>
              <h2 className={styles.columnTitle}>Admin Panel</h2>
              <ul className={styles.linkList}>
                <li className={styles.linkItem}>
                  <Link to="/admin">Admin Dashboard</Link>
                </li>
                {/* Add more admin links here if needed */}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sitemap;
