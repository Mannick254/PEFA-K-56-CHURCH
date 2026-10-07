import React, { useState, useEffect } from 'react';
import styles from '../styles/CookieModal.module.css';

const DEFAULT_CATEGORIES = {
  necessary: true, // Always required and enabled
  analytics: false,
  marketing: false,
  preferences: false,
};

const CookieModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    // Check saved consent status on mount
    const savedConsent = localStorage.getItem('cookieConsent');
    
    if (!savedConsent) {
      setShowModal(true);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        if (parsed && typeof parsed === 'object') {
          setPreferences((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        // Fallback for legacy string values like 'true'/'false'
        if (savedConsent === 'false') {
          setPreferences({ ...DEFAULT_CATEGORIES, analytics: false, marketing: false, preferences: false });
        }
      }
    }

    // Custom Event Listener allowing footers/settings pages to re-open the modal
    const handleReopen = () => {
      setShowModal(true);
      setShowDetails(true);
    };

    window.addEventListener('open-cookie-settings', handleReopen);
    return () => window.removeEventListener('open-cookie-settings', handleReopen);
  }, []);

  const saveConsent = (consentData) => {
    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    localStorage.setItem('cookieConsentTimestamp', new Date().toISOString());
    setPreferences(consentData);
    setShowModal(false);
    setShowDetails(false);

    // Dispatch custom event so analytics/trackers can initialize/disable dynamically
    window.dispatchEvent(
      new CustomEvent('cookieConsentUpdated', { detail: consentData })
    );
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  };

  const handleDeclineAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const handleToggleCategory = (category) => {
    if (category === 'necessary') return; // Cannot toggle necessary cookies
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!showModal) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-title"
      aria-describedby="cookie-modal-description"
    >
      <div className={styles.card}>
        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.iconBadge}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
              <path d="M8.5 8.5v.01" />
              <path d="M16 15.5v.01" />
              <path d="M12 12v.01" />
              <path d="M11 17v.01" />
              <path d="M7 14v.01" />
            </svg>
          </div>
          <div>
            <h2 id="cookie-modal-title" className={styles.title}>
              We Value Your Privacy
            </h2>
            <p className={styles.subtitle}>
              Customize your preferences or accept our default cookie settings.
            </p>
          </div>
        </div>

        {/* Description Body */}
        <p id="cookie-modal-description" className={styles.message}>
          We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.{' '}
          <a href="/privacy" className={styles.link} target="_parent" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </p>

        {/* Detailed Preferences View */}
        {showDetails && (
          <div className={styles.preferencesContainer}>
            {/* Necessary Cookies */}
            <div className={styles.categoryRow}>
              <div className={styles.categoryInfo}>
                <span className={styles.categoryTitle}>Strictly Necessary</span>
                <span className={styles.categoryDesc}>
                  Essential for the core functionality of the website. Cannot be disabled.
                </span>
              </div>
              <label className={`${styles.switch} ${styles.disabled}`}>
                <input type="checkbox" checked disabled readOnly />
                <span className={styles.slider}></span>
              </label>
            </div>

            {/* Analytics Cookies */}
            <div className={styles.categoryRow}>
              <div className={styles.categoryInfo}>
                <span className={styles.categoryTitle}>Analytics</span>
                <span className={styles.categoryDesc}>
                  Helps us understand how visitors interact with the site anonymously.
                </span>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={() => handleToggleCategory('analytics')}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            {/* Marketing Cookies */}
            <div className={styles.categoryRow}>
              <div className={styles.categoryInfo}>
                <span className={styles.categoryTitle}>Marketing</span>
                <span className={styles.categoryDesc}>
                  Used to deliver relevant ads and track ad performance.
                </span>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={() => handleToggleCategory('marketing')}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            {/* Preferences Cookies */}
            <div className={styles.categoryRow}>
              <div className={styles.categoryInfo}>
                <span className={styles.categoryTitle}>Preferences</span>
                <span className={styles.categoryDesc}>
                  Allows the website to remember choices like your language or region.
                </span>
              </div>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={() => handleToggleCategory('preferences')}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actions}>
          {!showDetails ? (
            <>
              <button onClick={handleAcceptAll} className={`${styles.btn} ${styles.primaryBtn}`}>
                Accept All
              </button>
              <button onClick={handleDeclineAll} className={`${styles.btn} ${styles.secondaryBtn}`}>
                Reject Non-Essential
              </button>
              <button
                onClick={() => setShowDetails(true)}
                className={`${styles.btn} ${styles.outlineBtn}`}
              >
                Customize
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSavePreferences} className={`${styles.btn} ${styles.primaryBtn}`}>
                Save Preferences
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className={`${styles.btn} ${styles.secondaryBtn}`}
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieModal;