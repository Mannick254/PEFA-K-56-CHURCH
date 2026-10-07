import React from 'react';
import styles from './WarningModal.module.css';
import { FaCheckCircle } from 'react-icons/fa';

const DevelopmentWarningModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Holyrics Studio: Under Development</h2>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          <p>
            Welcome to Holyrics Studio! Please be aware that this application is currently in an active development phase.          </p>
          <h3>Key Features:</h3>
          <ul>
            <li><FaCheckCircle className={styles.checkIcon} /> Real-time lyric projection.</li>
            <li><FaCheckCircle className={styles.checkIcon} /> Multi-screen support.</li>
            <li><FaCheckCircle className={styles.checkIcon} /> Offline capability.</li>
            <li><FaCheckCircle className={styles.checkIcon} /> Song and setlist management.</li>
            <li><FaCheckCircle className={styles.checkIcon} /> Installable as a desktop or mobile app.</li>
          </ul>
          <p>
            We appreciate your understanding and welcome any feedback to help us improve.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevelopmentWarningModal;
