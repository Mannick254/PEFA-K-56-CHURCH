import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import useAuthStore from '../store';
import styles from '../styles/Profile.module.css';

const Profile = () => {
  const { user, loading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({ username: '', isAdmin: false });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin, username')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          setProfile({
            isAdmin: data.is_admin || false,
            username: data.username || user.email.split('@')[0],
          });
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleResetPassword = async () => {
    setActionLoading(true);
    setFeedback({ type: '', msg: '' });

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setFeedback({ type: 'error', msg: error.message });
    } else {
      setFeedback({ type: 'success', msg: 'Check your inbox for the reset link!' });
    }
    setActionLoading(false);
  };

  const avatarUrl = user?.user_metadata?.avatar_url;

  if (authLoading || loading) return <div className={styles.loader}>Loading Profile...</div>;
  if (!user) return <div className={styles.errorContainer}>Please log in to view your profile.</div>;

  return (
    <div className={styles.pageWrapper}>
      {/* Admin Quick Action Bar */}
      {profile.isAdmin && (
        <div className={styles.adminBanner}>
          <span>Administrator Access Active</span>
          <button onClick={() => navigate('/admin')} className={styles.adminBadgeButton}>
            Back to Dashboard →
          </button>
        </div>
      )}

      <div className={styles.profileCard}>
        <div className={styles.cardHeader}>
          <div className={styles.avatarCircle}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={profile.username} className={styles.avatarImage} />
            ) : (
              profile.username?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <h2 className={styles.userName}>{profile.username}</h2>
          <p className={styles.userEmail}>{user.email}</p>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Account Role</span>
            <span className={profile.isAdmin ? styles.roleAdmin : styles.roleUser}>
              {profile.isAdmin ? 'Administrator' : 'Standard User'}
            </span>
          </div>
        </div>

        <div className={styles.cardActions}>
          <h3 className={styles.sectionTitle}>Security Settings</h3>
          <p className={styles.sectionDesc}>Update your password by requesting a secure reset link.</p>
          
          <button 
            onClick={handleResetPassword} 
            disabled={actionLoading} 
            className={styles.primaryButton}
          >
            {actionLoading ? 'Processing...' : 'Send Password Reset Email'}
          </button>

          {feedback.msg && (
            <div className={`${styles.feedback} ${styles[feedback.type]}`}>
              {feedback.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
