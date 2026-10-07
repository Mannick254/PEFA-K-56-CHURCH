import React, { useState, useEffect } from 'react';
import styles from '../../styles/IctAdmin.light.module.css';
import IctNavbar from '../../components/IctNavbar';
import IctFooter from '../../components/IctFooter';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';

// Mock content components
const Dashboard = () => <div><h2>Dashboard</h2><p>Welcome to the main dashboard. Here you can see an overview of the system's activity.</p></div>;
const ManageUsers = () => <div><h2>Manage Users</h2><p>Here you can add, remove, or edit user information and permissions.</p></div>;
const SystemSettings = () => <div><h2>System Settings</h2><p>Here you can configure system-wide settings and preferences.</p></div>;


const IctAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const loggedIn = localStorage.getItem('ict_admin_logged_in');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // IMPORTANT: Replace with a real, secure authentication method!
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      localStorage.setItem('ict_admin_logged_in', 'true');
      setError('');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ict_admin_logged_in');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <ManageUsers />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginOverlay}>
        <div className={styles.loginModal}>
          <h2 className={styles.loginTitle}>Admin Access</h2>
          <p className={styles.loginSubtitle}>Please sign in to access the ICT Admin Panel.</p>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.loginInput}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.loginInput}
              required
            />
            <button type="submit" className={styles.loginButton}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <IctNavbar />
      <main className={styles.mainContent}>
        <header className={styles.header}>
            <div className={styles.container}>
                <h1>ICT Admin Panel</h1>
            </div>
        </header>
        <div className={styles.container}>
          <div className={styles.adminDashboard}>
            <aside className={styles.sidebar}>
              <h3>Navigation</h3>
              <ul className={styles.navList}>
                <li className={styles.navItem}>
                  <a href="#" onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? styles.active : ''}>
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </a>
                </li>
                <li className={styles.navItem}>
                  <a href="#" onClick={() => setActiveTab('users')} className={activeTab === 'users' ? styles.active : ''}>
                    <Users size={18} />
                    <span>Manage Users</span>
                  </a>
                </li>
                <li className={styles.navItem}>
                  <a href="#" onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? styles.active : ''}>
                    <Settings size={18} />
                    <span>Settings</span>
                  </a>
                </li>
              </ul>
              <button onClick={handleLogout} className={styles.logoutButton}>
                 <LogOut size={18} />
                <span>Logout</span>
              </button>
            </aside>
            <section className={styles.contentArea}>
              {renderContent()}
            </section>
          </div>
        </div>
      </main>
      <IctFooter />
    </div>
  );
};

export default IctAdmin;