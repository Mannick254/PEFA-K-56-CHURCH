import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/Login.module.css';
import Seo from '../components/Seo';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      // Note: For this to work, you need to create a table in Supabase named 'admin_credentials'
      // with two columns: 'username' (text) and 'email' (text).
      // Add a row for each admin with their desired username and their registered email.
      // You must also enable Row Level Security (RLS) on this table and create a policy
      // that allows read access for all users.

      // Fetch the email associated with the admin username
      const { data: adminData, error: adminError } = await supabase
        .from('admin_credentials')
        .select('email')
        .eq('username', username.trim())
        .single();

      if (adminError || !adminData) {
        setStatus({ type: 'error', msg: 'Invalid Admin Credentials' });
        setLoading(false);
        return;
      }

      const email = adminData.email;

      // Authenticate
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setStatus({ type: 'error', msg: authError.message });
        setLoading(false);
        return;
      }

      // Verify Admin Status
      let isAdmin = false;

      // Check profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', authData.user.id)
        .single();

      if (!profileError && profile?.is_admin) {
        isAdmin = true;
      }

      // Fallback: check user_metadata
      if (authData.user.user_metadata?.role === 'admin') {
        isAdmin = true;
      }

      if (!isAdmin) {
        await supabase.auth.signOut();
        setStatus({ type: 'error', msg: 'Unauthorized: Admin access required.' });
        setLoading(false);
        return;
      }

      // Success
      setStatus({ type: 'success', msg: 'Verification successful! Redirecting to dashboard...' });
      window.dispatchEvent(new CustomEvent('login-success'));

      setTimeout(() => {
        navigate('/admin');
      }, 2500);

    } catch (err) {
      console.error('Unexpected error:', err);
      setStatus({ type: 'error', msg: 'Something went wrong.' });
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <Seo title="Admin Login" />
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <div className={styles.adminIcon}>🛡️</div>
          <h2>Admin Portal</h2>
          <p>Secure system access for authorized personnel only</p>
        </div>

        {status.type === 'success' ? (
          <div className={styles.successWrapper}>
            <div className={styles.checkmark}>✓</div>
            <p>{status.msg}</p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill}></div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className={styles.form}>
            {status.type === 'error' && (
              <div className={styles.errorMessage}>
                <span>⚠️</span> {status.msg}
              </div>
            )}

            <div className={styles.inputGroup}>
              <label>Admin ID</label>
              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? <span className={styles.loader}></span> : 'Authorize Access'}
            </button>
            
            <Link to="/" className={styles.backLink}>Return to Public Site</Link>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;