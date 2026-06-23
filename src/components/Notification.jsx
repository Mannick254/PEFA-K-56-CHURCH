import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import styles from '../styles/Notification.module.css';

const ICON_MAP = {
  success: <CheckCircle2 size={20} />,
  error: <XCircle size={20} />,
  info: <Info size={20} />,
  warning: <AlertCircle size={20} />,
};

const Notification = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose 
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const [shouldRender, setShouldRender] = useState(false);
  const timerRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Handle entry animation
  useEffect(() => {
    if (message) {
      setShouldRender(true);
      startTimers();
    }
    return () => clearTimers();
  }, [message]);

  const startTimers = () => {
    const step = 100 / (duration / 100); // Update every 100ms
    
    // Auto-close timer
    timerRef.current = setTimeout(() => {
      handleClose();
    }, duration);

    // Progress bar interval
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => Math.max(prev - step, 0));
    }, 100);
  };

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
    clearTimers();
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    // Restart with remaining time would be ideal, 
    // but for simplicity, we resume or just let it finish.
    startTimers(); 
  };

  const handleClose = () => {
    setShouldRender(false);
    // Wait for exit animation to complete (300ms)
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  if (!message && !shouldRender) return null;

  return (
    <div
      className={`${styles.notification} ${styles[type]} ${shouldRender ? styles.show : styles.hide}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
    >
      <div className={styles.content}>
        <span className={styles.icon}>{ICON_MAP[type]}</span>
        <p className={styles.message}>{message}</p>
        <button onClick={handleClose} className={styles.closeButton} aria-label="Close">
          <X size={18} />
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div 
          className={styles.progressBar} 
          style={{ 
            width: `${progress}%`,
            transition: isPaused ? 'none' : 'width 0.1s linear'
          }} 
        />
      </div>
    </div>
  );
};

export default Notification;