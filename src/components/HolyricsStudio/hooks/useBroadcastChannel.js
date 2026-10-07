import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to safely interact with the BroadcastChannel API.
 * 
 * @param {string} channelName - The name of the channel to subscribe to.
 * @param {Function} [onMessage] - Callback executed when a message is received.
 * @returns {Function} postMessage - Function to post a message to the channel.
 */
export function useBroadcastChannel(channelName, onMessage) {
  const channelRef = useRef(null);
  const onMessageRef = useRef(onMessage);

  // Keep onMessage ref up to date to prevent unnecessary channel reconnects
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window) || !channelName) {
      return;
    }

    const channel = new BroadcastChannel(channelName);
    channelRef.current = channel;

    const handleMessage = (event) => {
      onMessageRef.current?.(event.data, event);
    };

    channel.addEventListener('message', handleMessage);

    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
      channelRef.current = null;
    };
  }, [channelName]);

  const postMessage = useCallback((message) => {
    if (channelRef.current) {
      channelRef.current.postMessage(message);
    } else {
      console.warn(`[useBroadcastChannel] Cannot send message: Channel "${channelName}" is closed or unsupported.`);
    }
  }, [channelName]);

  return postMessage;
}