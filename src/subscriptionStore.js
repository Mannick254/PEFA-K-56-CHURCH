import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { supabase } from './supabaseClient';

/**
 * useSubscriptionStore
 * A robust store for managing Supabase Realtime connections.
 */
const useSubscriptionStore = create(
  devtools((set, get) => ({
    // Store active channels using a Map for O(1) access and better memory management
    channels: new Map(),

    /**
     * Subscribe to Postgres changes
     * @param {Object} options
     * @param {string} options.table - Table name
     * @param {string} [options.event='*'] - INSERT, UPDATE, DELETE, or *
     * @param {string} [options.schema='public'] - Database schema
     * @param {string} [options.filter] - Column filter (e.g., 'id=eq.123')
     * @param {function} callback - Function to handle payload
     * @returns {string} channelId - Use this to unsubscribe later
     */
    subscribe: ({ table, event = '*', schema = 'public', filter = undefined }, callback) => {
      const { channels } = get();
      
      // Generate a unique key based on the parameters to allow multiple granular subscriptions
      const channelId = `${schema}:${table}:${event}:${filter || 'no-filter'}`;

      if (channels.has(channelId)) {
        console.warn(`[Realtime] Active subscription already exists: ${channelId}`);
        return channelId;
      }

      const channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          { event, schema, table, filter },
          (payload) => {
            console.debug(`[Realtime] Event [${event}] on [${table}]:`, payload);
            callback(payload);
          }
        )
        .subscribe((status, err) => {
          if (err) {
            console.error(`[Realtime] Subscription error for ${channelId}:`, err);
          }
          if (status === 'SUBSCRIBED') {
            console.info(`[Realtime] Connected to ${channelId}`);
          }
        });

      // Update state with the new Map
      set((state) => ({
        channels: new Map(state.channels).set(channelId, channel),
      }));

      return channelId;
    },

    /**
     * Unsubscribe from a specific channelId
     * @param {string} channelId
     */
    unsubscribe: async (channelId) => {
      const { channels } = get();
      const channel = channels.get(channelId);

      if (!channel) return;

      try {
        await supabase.removeChannel(channel);
        
        set((state) => {
          const newChannels = new Map(state.channels);
          newChannels.delete(channelId);
          return { channels: newChannels };
        });
        
        console.info(`[Realtime] Unsubscribed: ${channelId}`);
      } catch (error) {
        console.error(`[Realtime] Failed to unsubscribe from ${channelId}:`, error);
      }
    },

    /**
     * Cleanup all active subscriptions (Useful for logout or global unmount)
     */
    unsubscribeAll: async () => {
      const { channels } = get();
      
      await Promise.all(
        Array.from(channels.values()).map((channel) => supabase.removeChannel(channel))
      );

      set({ channels: new Map() });
      console.info(`[Realtime] All channels cleared.`);
    },
  }))
);

export default useSubscriptionStore;