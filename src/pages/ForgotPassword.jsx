import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import styles from '../styles/ForgotPassword.module.css';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset email sent. Please check your inbox.');
    }

    setLoading(false);
  };

  return (
    <div className={styles.forgotPasswordContainer}>
        <Seo title="Forgot Password" description="Reset your password for your PEFA Kawangware 56 account."/>
      <div className={styles.forgotPasswordFormWrapper}>
        <h2>Forgot Password</h2>
        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handlePasswordReset}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Send Reset Link'}
          </button>
        </form>
        <p>
          <Link to="/">Back to Site</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
