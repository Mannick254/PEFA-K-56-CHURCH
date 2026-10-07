// subscriptionStore.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from './supabaseClient';

const useSubscriptionStore = create(
  devtools((set, get) => ({
    channels: new Map(),
    subscribe: (options, callback) => {
      // ... subscription logic
    },
    unsubscribe: async (channelId) => {
      // ... unsubscribe logic
    },
    unsubscribeAll: async () => {
      // ... clear logic
    }
  }))
);

// MUST HAVE THIS EXPORT AT THE BOTTOM
export default useSubscriptionStore;