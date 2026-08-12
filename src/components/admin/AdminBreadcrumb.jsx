import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from '../../styles/AdminBreadcrumb.module.css';

const AdminBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Function to convert path segment to a readable title
  const toTitleCase = (str) => {
    return str
      .replace(/-/g, ' ') // Replace hyphens with spaces
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
  };

  if (pathnames.length < 2) {
    // Don't render breadcrumb on the main /admin page
    return null;
  }

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumb}>
      <ol className={styles.breadcrumbList}>
        <li className={styles.breadcrumbItem}>
          <Link to="/admin">Admin</Link>
        </li>
        {pathnames.slice(1).map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 2).join('/')}`;
          const isLast = index === pathnames.length - 2;
          const title = toTitleCase(name);

          return isLast ? (
            <li key={name} className={`${styles.breadcrumbItem} ${styles.active}`} aria-current="page">
              {title}
            </li>
          ) : (
            <li key={name} className={styles.breadcrumbItem}>
              <Link to={routeTo}>{title}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default AdminBreadcrumb;
