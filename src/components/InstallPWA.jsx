import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import s from '../styles/InstallPWA.module.css';

const InstallPWA = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Check if the user has already dismissed this recently
    const isDismissed = localStorage.getItem('pwa_dismissed');
    if (isDismissed) {
      const timestamp = parseInt(isDismissed, 10);
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (now - timestamp < sevenDays) return; // Don't show if dismissed within 7 days
    }

    // 2. Handle Android / Chrome / Windows prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    // 3. Handle iOS detection (iOS does not support beforeinstallprompt)
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isIOSDevice && !isStandalone) {
      setIsIOS(true);
      setShowPrompt(true);
    }

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed successfully');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleClose = () => {
    // Store timestamp of dismissal
    localStorage.setItem('pwa_dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className={s.installToast}>
      <button className={s.closeIcon} onClick={handleClose}>
        <X size={18} />
      </button>
      
      <div className={s.iconWrapper}>
        <div className={s.appLogo}>
          {/* Replace with your actual App Icon */}
          <Download size={24} color="#D4AF37" />
        </div>
      </div>

      <div className={s.content}>
        <h4>{isIOS ? 'Install Web App' : 'Get the App'}</h4>
        <p>
          {isIOS 
            ? <>Tap <Share size={14} inline /> then <strong>"Add to Home Screen"</strong></>
            : 'Install our app for a faster, offline-ready experience.'
          }
        </p>
      </div>

      {!isIOS && (
        <button onClick={handleInstallClick} className={s.installButton}>
          Install Now
        </button>
      )}
    </div>
  );
};

export default InstallPWA;