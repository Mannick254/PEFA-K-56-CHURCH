import React, { useEffect, useState, useMemo } from 'react';

const DEFAULT_STATE = {
  content: '',
  title: '',
  isClearText: false,
  isBlackout: false,
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontColor: '#ffffff',
};

export default function StreamOverlay() {
  const [liveData, setLiveData] = useState(DEFAULT_STATE);

  // Broadcast Channel Synchronization
  useEffect(() => {
    let bc;
    try {
      bc = new BroadcastChannel('pefak56_holyrics_channel');

      bc.onmessage = (event) => {
        if (event.data?.type === 'SYNC_STATE' && event.data.payload) {
          setLiveData((prev) => ({
            ...prev,
            ...event.data.payload,
          }));
        }
      };
    } catch (error) {
      console.error('BroadcastChannel API is not supported in this environment:', error);
    }

    return () => bc?.close();
  }, []);

  // Determine visibility
  const isVisible = useMemo(() => {
    return !liveData.isBlackout && !liveData.isClearText && Boolean(liveData.content?.trim());
  }, [liveData.isBlackout, liveData.isClearText, liveData.content]);

  return (
    <>
      {/* Inline styles for keyframe animations */}
      <style>{`
        @keyframes lowerThirdIn {
          from {
            opacity: 0;
            transform: translate(-50%, 20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
      `}</style>

      <div
        style={{
          width: '100vw',
          height: '100vh',
          position: 'relative',
          backgroundColor: 'transparent',
          overflow: 'hidden',
          userSelect: 'none',
          boxSizing: 'border-box',
        }}
      >
        {isVisible && (
          <div
            style={{
              position: 'absolute',
              bottom: '50px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(12, 14, 18, 0.88)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderLeft: '6px solid #3b82f6',
              borderRadius: '12px',
              padding: '1.25rem 2.5rem',
              maxWidth: '85%',
              width: 'max-content',
              minWidth: '400px',
              textAlign: 'center',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
              animation: 'lowerThirdIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {/* Optional Title Badge */}
            {liveData.title && (
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#3b82f6',
                  marginBottom: '6px',
                  textAlign: 'left',
                }}
              >
                {liveData.title}
              </div>
            )}

            {/* Song Content / Verse Lyrics */}
            <p
              style={{
                fontSize: '1.85rem',
                fontWeight: '600',
                lineHeight: '1.4',
                color: liveData.fontColor || '#ffffff',
                fontFamily: liveData.fontFamily || DEFAULT_STATE.fontFamily,
                margin: 0,
                whiteSpace: 'pre-line',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                wordBreak: 'break-word',
              }}
            >
              {liveData.content}
            </p>
          </div>
        )}
      </div>
    </>
  );
}