import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Loader2 
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import styles from '../styles/DataLogin.module.css';
import Seo from '../components/Seo';

const DataLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const cleanUsername = username.trim();

      if (!supabase) {
        throw new Error('Supabase client is not initialized.');
      }

      // 1. Fetch email from data_credentials using case-insensitive match (ilike)
      const { data: userData, error: userError } = await supabase
        .from('data_credentials')
        .select('email')
        .ilike('username', cleanUsername)
        .maybeSingle();

      if (userError || !userData?.email) {
        setStatus({ type: 'error', msg: 'Invalid username or password credentials.' });
        setLoading(false);
        return;
      }

      // 2. Authenticate against Supabase Auth using the mapped email
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: password,
      });

      if (authError) {
        setStatus({ type: 'error', msg: authError.message });
        setLoading(false);
        return;
      }

      // 3. Set local storage/session flag & trigger success event
      sessionStorage.setItem('hasDataAccess', 'true');
      setStatus({ type: 'success', msg: 'Authorization granted. Redirecting to dashboard...' });
      window.dispatchEvent(new CustomEvent('login-success'));

      setTimeout(() => {
        navigate('/church-data');
      }, 1800);

    } catch (err) {
      console.error('Unexpected login error:', err);
      setStatus({ type: 'error', msg: err?.message || 'An unexpected system error occurred. Please try again.' });
      setLoading(false);
    }
  };

  return (
    <div className={styles?.loginPage || 'loginPage'}>
      {Seo && <Seo title="Data Portal Login" />}

      <motion.div 
        className={styles?.loginCard || 'loginCard'}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className={styles?.header || 'header'}>
          <div className={styles?.adminBadge || 'adminBadge'}>
            <ShieldCheck size={28} />
          </div>
          <h2>Data Access Portal</h2>
          <p>Secure authentication for authorized administration personnel</p>
        </div>

        <AnimatePresence mode="wait">
          {status.type === 'success' ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={styles?.successWrapper || 'successWrapper'}
            >
              <div className={styles?.checkmarkWrapper || 'checkmarkWrapper'}>
                <CheckCircle2 size={48} className={styles?.checkmarkIcon || 'checkmarkIcon'} />
              </div>
              <h3>Authenticated</h3>
              <p>{status.msg}</p>
              <div className={styles?.progressBar || 'progressBar'}>
                <motion.div 
                  className={styles?.progressFill || 'progressFill'}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.8, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.form 
              key="form"
              onSubmit={handleLogin} 
              className={styles?.form || 'form'}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {status.type === 'error' && (
                <motion.div 
                  className={styles?.errorMessage || 'errorMessage'}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle size={18} />
                  <span>{status.msg}</span>
                </motion.div>
              )}

              <div className={styles?.inputGroup || 'inputGroup'}>
                <label htmlFor="username">Username</label>
                <div className={styles?.inputWrapper || 'inputWrapper'}>
                  <User size={18} className={styles?.inputIcon || 'inputIcon'} />
                  <input
                    id="username"
                    type="text"
                    placeholder="Enter admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className={styles?.inputGroup || 'inputGroup'}>
                <label htmlFor="password">Password</label>
                <div className={styles?.inputWrapper || 'inputWrapper'}>
                  <Lock size={18} className={styles?.inputIcon || 'inputIcon'} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles?.togglePassword || 'togglePassword'}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className={styles?.loginBtn || 'loginBtn'} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 size={18} className={styles?.spinner || 'spinner'} />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  'Authorize Access'
                )}
              </button>

              <div className={styles?.footerLinks || 'footerLinks'}>
                <Link to="/" className={styles?.backLink || 'backLink'}>
                  <ArrowLeft size={16} />
                  <span>Return to Public Site</span>
                </Link>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DataLogin;