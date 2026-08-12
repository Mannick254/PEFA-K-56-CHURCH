import React, { useState, useEffect } from 'react';
import styles from '../../styles/IctAdmin.module.css';
import IctNavbar from '../../components/IctNavbar';
import IctFooter from '../../components/IctFooter';

const IctAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('ict_admin_logged_in');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Replace with a more secure authentication method
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      localStorage.setItem('ict_admin_logged_in', 'true');
      setError('');
    } else {
      setError('Invalid credentials, please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('ict_admin_logged_in');
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginOverlay}>
        <div className={styles.loginModal}>
          <h2 className={styles.loginTitle}>Admin Access Required</h2>
          <p className={styles.loginSubtitle}>Please sign in to continue.</p>
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
        <header className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>ICT Team Admin</h1>
            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
          </div>
        </header>
        <section className={styles.adminSection}>
          <div className={styles.container}>
            <p>Welcome to the ICT Team Admin Panel. This is where you can manage the ICT team's services, projects, and members.</p>
          </div>
        </section>
      </main>
      <IctFooter />
    </div>
  );
};

export default IctAdmin;
