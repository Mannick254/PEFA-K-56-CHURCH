import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/Admin.module.css';

const Admin = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.user_metadata?.is_admin) {
        setUser(user);
      } else {
        navigate('/'); // Redirect if not an admin
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className={styles.adminContainer}>
      <h2>Admin Dashboard</h2>
      {user && <p>Welcome, {user.email}!</p>}
      {/* Add more admin-specific content here */}
    </div>
  );
};

export default Admin;
