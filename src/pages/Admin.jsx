import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminBreadcrumb from '../components/admin/AdminBreadcrumb';
import styles from '../styles/Admin.module.css';
import Loading from '../components/Loading';
import { DrawerProvider } from '../context/DrawerContext';

const Admin = () => {
  const location = useLocation();
  const showAdminBreadcrumb = location.pathname !== '/admin';

  return (
    <DrawerProvider>
      <>
        <div className={styles.adminLayout}>
          <AdminNavbar />
          <main className={styles.mainContent}>
            <div className={styles.contentWrapper}>
              {showAdminBreadcrumb && <AdminBreadcrumb />}
              <div className={styles.outletContainer}>
                <Suspense fallback={<Loading />}>
                  <Outlet />
                </Suspense>
              </div>
            </div>
          </main>
        </div>
      </>
    </DrawerProvider>
  );
};

export default Admin;