import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Mail, Lock, LogIn, CheckCircle2, AlertCircle } from 'lucide-react';
import styles from '../styles/LoginUser.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setIsSuccess(true);
      window.dispatchEvent(new CustomEvent('login-success'));
      
      // Navigate after 3 seconds as per original logic
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  async function signInWithGoogle() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://pefa-k-56-church.vercel.app'
      }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginFormWrapper}>
        <div className={styles.header}>
          <div className={styles.logoIcon}>
            <LogIn size={32} />
          </div>
          <h2>Welcome Back</h2>
          <p>Please enter your details to sign in</p>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className={styles.successState}>
            <CheckCircle2 size={48} className={styles.successIcon} />
            <h3>Login Successful!</h3>
            <p>Redirecting you to the dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={18} />
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.labelRow}>
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className={styles.forgotLink}>
                  Forgot Password?
                </Link>
              </div>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={18} />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={loading}
            >
              {loading ? (
                <span className={styles.loader}></span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        )}
        <div className={styles.separator}>OR</div>
        <button
            onClick={signInWithGoogle}
            className={styles.googleBtn}
            disabled={loading}
        >
            Sign In with Google
        </button>

        <div className={styles.footer}>
          <p>
            Don't have an account? <Link to="/register">Create account</Link>
          </p>
          <p>
            <Link to="/">Back to Site</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
