import React, { useEffect, useState, useMemo } from 'react';

const DEFAULT_STATE = {
  title: '',
  content: '',
  nextContent: '',
  isBlackout: false,
  isClearText: false,
};

export default function StageMonitor() {
  const [liveData, setLiveData] = useState(DEFAULT_STATE);
  const [time, setTime] = useState('');

  // Digital Clock Updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now)
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Calculate Status Indicator (Blackout / Clear / Live)
  const statusBadge = useMemo(() => {
    if (liveData.isBlackout) {
      return { text: 'BLACKOUT', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)' };
    }
    if (liveData.isClearText) {
      return { text: 'CLEAR', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)' };
    }
    return { text: 'LIVE', color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' };
  }, [liveData.isBlackout, liveData.isClearText]);

  return (
    <div
      style={{
        backgroundColor: '#000000',
        color: '#ffffff',
        width: '100vw',
        height: '100vh',
        padding: '2.5rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justify: 'space-between',
        fontFamily: "'Fira Code', 'Courier New', Consolas, monospace",
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Stage Header / Meta Bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          borderBottom: '2px solid #222630',
          paddingBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span
            style={{
              fontSize: '0.85rem',
              fontWeight: '700',
              letterSpacing: '1px',
              padding: '4px 10px',
              borderRadius: '4px',
              color: statusBadge.color,
              backgroundColor: statusBadge.bg,
              border: `1px solid ${statusBadge.color}`,
            }}
          >
            {statusBadge.text}
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#e2e8f0',
              letterSpacing: '0.5px',
            }}
          >
            {liveData.title || 'PEFAK56 STAGE MONITOR'}
          </h2>
        </div>

        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#00ffcc' }}>
          {time}
        </div>
      </header>

      {/* Main Content Area (Active Slide Verse/Chorus) */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: '2rem 1rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '3.75rem',
            lineHeight: '1.3',
            fontWeight: '700',
            color: liveData.isBlackout || liveData.isClearText ? '#334155' : '#ffea00',
            whiteSpace: 'pre-line',
            margin: 0,
            maxWidth: '95%',
            wordBreak: 'break-word',
            textShadow: liveData.isBlackout || liveData.isClearText ? 'none' : '0 0 20px rgba(255, 234, 0, 0.2)',
          }}
        >
          {liveData.isBlackout
            ? '[ BLACKOUT ]'
            : liveData.isClearText
            ? '[ TEXT CLEARED ]'
            : liveData.content || '[ READY FOR LIVE ]'}
        </h1>
      </main>

      {/* Next Slide Preview Section */}
      <footer
        style={{
          backgroundColor: '#0f172a',
          padding: '1.25rem 1.75rem',
          borderRadius: '10px',
          borderLeft: '6px solid #00ffcc',
          borderTop: '1px solid #1e293b',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: '700',
            color: '#64748b',
            letterSpacing: '1px',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
          }}
        >
          NEXT SLIDE
        </div>
        <p
          style={{
            fontSize: '1.65rem',
            lineHeight: '1.3',
            color: '#94a3b8',
            margin: 0,
            whiteSpace: 'pre-line',
            fontWeight: '500',
          }}
        >
          {liveData.nextContent || 'End of Item / Blank'}
        </p>
      </footer>
    </div>
  );
}