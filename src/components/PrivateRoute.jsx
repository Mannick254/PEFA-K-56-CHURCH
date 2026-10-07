import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // 1. Check local session state first to avoid throwing errors on fresh loads
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          if (isMounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        // 2. Validate token/user status with Supabase if a session exists
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();

        if (isMounted) {
          setUser(error ? null : currentUser);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    checkAuth();

    // 3. Keep real-time auth changes synchronized
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  const hasDataAccess = sessionStorage.getItem('hasDataAccess') === 'true';
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (user) {
    if (isAdminRoute && user.user_metadata?.role === 'admin') {
      return children;
    }
    if (!isAdminRoute && hasDataAccess) {
      return children;
    }
  }

  // Redirect to correct login route
  const redirectTo = isAdminRoute ? '/admin-login' : '/data-login';

  return <Navigate to={redirectTo} state={{ from: location }} replace />;
};

export default PrivateRoute;