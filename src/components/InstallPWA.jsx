import React, { useState, useEffect } from 'react';
import { X, Share } from 'lucide-react';
import s from '../styles/InstallPWA.module.css';

const InstallPWA = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;

    const isDismissed = localStorage.getItem('pwa_dismissed');
    if (isDismissed) {
      const timestamp = parseInt(isDismissed, 10);
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (now - timestamp < sevenDays) return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOSDevice) {
      setIsIOS(true);
      setShowPrompt(true);
    }

    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa_dismissed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.info('PWA installed successfully');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleClose = () => {
    localStorage.setItem('pwa_dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className={s.installToast} role="dialog" aria-label="Install App Prompt">
      <button className={s.closeIcon} onClick={handleClose} aria-label="Close notification">
        <X size={18} />
      </button>

      <div className={s.iconWrapper}>
        <div className={s.appLogo}>
          <img src="https://res.cloudinary.com/dtcb3ffnv/image/upload/w_48,h_48,c_fill/v1780723691/Untitled-design-24-_lfef05.png" alt="App Logo" style={{ width: '28px', height: '28px', borderRadius: '4px' }} />
        </div>
      </div>

      <div className={s.content}>
        <h4>{isIOS ? 'Install Web App' : 'Get the App'}</h4>
        <p>
          {isIOS ? (
            <>
              Tap <Share size={13} style={{ display: 'inline', verticalAlign: 'middle', margin: '0 2px' }} /> then{' '}
              <strong>"Add to Home Screen"</strong>
            </>
          ) : (
            'Install our app for a faster, offline-ready experience.'
          )}
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
