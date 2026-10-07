import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import useAuthStore from '../store';
import { 
  FaUser, 
  FaEnvelope, 
  FaShieldHalved, 
  FaKey, 
  FaHandHoldingHeart, /* Updated icon name */
  FaVideo, 
  FaHandsPraying, 
  FaBookOpen,
  FaPenToSquare,
  FaCheck,
  FaArrowRight
} from 'react-icons/fa6';
import { FiLogOut } from 'react-icons/fi';
import styles from '../styles/Profile.module.css';

const Profile = () => {
  const { user, signOut, loading: authLoading } = useAuthStore();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    username: '',
    fullName: '',
    isAdmin: false,
    createdAt: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', fullName: '' });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', msg: '' });

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('is_admin, username, full_name, created_at')
          .eq('id', user.id)
          .maybeSingle();

        const defaultUsername = user.email ? user.email.split('@')[0] : 'Member';

        if (data) {
          const userProfile = {
            isAdmin: data.is_admin || false,
            username: data.username || defaultUsername,
            fullName: data.full_name || '',
            createdAt: data.created_at || user.created_at
          };
          setProfile(userProfile);
          setFormData({ username: userProfile.username, fullName: userProfile.fullName });
        } else {
          setProfile({
            isAdmin: false,
            username: defaultUsername,
            fullName: '',
            createdAt: user.created_at
          });
          setFormData({ username: defaultUsername, fullName: '' });
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setFeedback({ type: '', msg: '' });

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: formData.username,
          full_name: formData.fullName,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setProfile((prev) => ({
        ...prev,
        username: formData.username,
        fullName: formData.fullName
      }));

      setIsEditing(false);
      setFeedback({ type: 'success', msg: 'Profile updated successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Failed to update profile.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setActionLoading(true);
    setFeedback({ type: '', msg: '' });

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setFeedback({ type: 'error', msg: error.message });
    } else {
      setFeedback({ type: 'success', msg: 'Password reset link dispatched to your inbox.' });
    }
    setActionLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const avatarUrl = user?.user_metadata?.avatar_url;

  if (authLoading || loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.spinner}></div>
        <p>Loading member profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.errorContainer}>
        <h2>Access Restricted</h2>
        <p>Please log in to access your PEFA K-56 member account.</p>
        <button onClick={() => navigate('/login')} className={styles.primaryButton}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      {profile.isAdmin && (
        <div className={styles.adminBanner}>
          <div className={styles.adminBannerInner}>
            <span className={styles.adminBadgeTag}>
              <FaShieldHalved /> Administrator Access Active
            </span>
            <button onClick={() => navigate('/admin')} className={styles.adminBadgeButton}>
              Admin Dashboard <FaArrowRight />
            </button>
          </div>
        </div>
      )}

      <div className={styles.profileContainer}>
        <aside className={styles.sidebarCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarCircle}>
              {avatarUrl ? (
                <img src={avatarUrl} alt={profile.username} className={styles.avatarImage} />
              ) : (
                <span>{profile.username?.charAt(0).toUpperCase() || 'M'}</span>
              )}
            </div>
            <h2 className={styles.userName}>{profile.fullName || profile.username}</h2>
            <p className={styles.userHandle}>@{profile.username}</p>
            
            <div className={styles.roleTag}>
              <FaShieldHalved size={12} />
              <span>{profile.isAdmin ? 'Administrator' : 'Church Member'}</span>
            </div>
          </div>

          <div className={styles.memberMeta}>
            <div className={styles.metaRow}>
              <FaEnvelope className={styles.metaIcon} />
              <div className={styles.metaDetail}>
                <label>Email Address</label>
                <span>{user.email}</span>
              </div>
            </div>
            <div className={styles.metaRow}>
              <FaUser className={styles.metaIcon} />
              <div className={styles.metaDetail}>
                <label>Member Since</label>
                <span>
                  {profile.createdAt 
                    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : 'Active Member'}
                </span>
              </div>
            </div>
          </div>

          <button onClick={handleLogout} className={styles.logoutButton}>
            <FiLogOut size={16} /> Sign Out
          </button>
        </aside>

        <main className={styles.mainContent}>
          {feedback.msg && (
            <div className={`${styles.feedbackBanner} ${styles[feedback.type]}`}>
              {feedback.msg}
            </div>
          )}

          <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h3>Personal Information</h3>
                <p>Manage your display details across the PEFA K-56 community portal.</p>
              </div>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className={styles.editToggleBtn}>
                  <FaPenToSquare /> Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className={styles.profileForm}>
                <div className={styles.inputGroup}>
                  <label htmlFor="username">Username / Handle</label>
                  <input
                    id="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="e.g. John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className={styles.formActions}>
                  <button type="submit" disabled={saveLoading} className={styles.saveBtn}>
                    {saveLoading ? 'Saving...' : <><FaCheck /> Save Changes</>}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelBtn}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.infoGrid}>
                <div className={styles.infoBox}>
                  <label>Display Name</label>
                  <p>{profile.fullName || 'Not specified'}</p>
                </div>
                <div className={styles.infoBox}>
                  <label>Username</label>
                  <p>@{profile.username}</p>
                </div>
              </div>
            )}
          </section>

          <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h3>Church Hub & Engagement</h3>
                <p>Quick access to worship services, giving, and prayer altar.</p>
              </div>
            </div>

            <div className={styles.hubGrid}>
              <Link to="/live" className={styles.hubCard}>
                <div className={styles.hubIcon}><FaVideo /></div>
                <h4>Live Service</h4>
                <p>Join the digital sanctuary</p>
              </Link>

              <Link to="/give" className={styles.hubCard}>
                <div className={styles.hubIcon}><FaHandHoldingHeart /></div>
                <h4>Give & Tithe</h4>
                <p>Support church missions</p>
              </Link>

              <Link to="/prayers" className={styles.hubCard}>
                <div className={styles.hubIcon}><FaHandsPraying /></div>
                <h4>Prayer Altar</h4>
                <p>Submit prayer requests</p>
              </Link>

              <Link to="/sermons" className={styles.hubCard}>
                <div className={styles.hubIcon}><FaBookOpen /></div>
                <h4>Sermons</h4>
                <p>Browse media archive</p>
              </Link>
            </div>
          </section>

          <section className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div>
                <h3>Account Security</h3>
                <p>Manage your password and security options.</p>
              </div>
            </div>

            <div className={styles.securityRow}>
              <div className={styles.securityMeta}>
                <FaKey className={styles.keyIcon} />
                <div>
                  <h4>Password Management</h4>
                  <p>Request an encrypted password reset link sent directly to <strong>{user.email}</strong>.</p>
                </div>
              </div>
              <button 
                onClick={handleResetPassword} 
                disabled={actionLoading} 
                className={styles.resetButton}
              >
                {actionLoading ? 'Dispatching...' : 'Reset Password'}
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;