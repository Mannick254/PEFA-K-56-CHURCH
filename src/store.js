
import { create } from 'zustand';
import { supabase } from './supabaseClient';

let idleTimeout = null;

const resetIdleTimer = () => {
  if (idleTimeout) {
    clearTimeout(idleTimeout);
  }
  idleTimeout = setTimeout(() => {
    useAuthStore.getState().signOut();
  }, 20 * 60 * 1000); // 20 minutes
};

const useAuthStore = create((set) => ({
  user: null,
  loading: true,

  // Actions
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
    if (idleTimeout) clearTimeout(idleTimeout);
    window.removeEventListener('mousemove', resetIdleTimer);
    window.removeEventListener('keydown', resetIdleTimer);
  },

  // Auth listener
  listenToAuthChanges: () => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      set({ user, loading: false });

      if (user) {
        resetIdleTimer();
        window.addEventListener('mousemove', resetIdleTimer);
        window.addEventListener('keydown', resetIdleTimer);
      } else {
        if (idleTimeout) clearTimeout(idleTimeout);
        window.removeEventListener('mousemove', resetIdleTimer);
        window.removeEventListener('keydown', resetIdleTimer);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
      if (idleTimeout) clearTimeout(idleTimeout);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
    };
  },
}));

// Initialize the auth listener right away
useAuthStore.getState().listenToAuthChanges();

export default useAuthStore;
