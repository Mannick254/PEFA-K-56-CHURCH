import React from 'react';
import styles from '../../styles/WarningModal.module.css';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const WarningModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <FaExclamationTriangle size={32} className={styles.icon} />
          </div>
          <h2 className={styles.title}>Unauthorized Access Warning</h2>
        </div>
        <p className={styles.message}>
          You have accessed a restricted area. If you are not an authorized administrator, you must leave this page immediately. Unauthorized use of this system is strictly prohibited and may be subject to legal action, including civil and criminal penalties.
        </p>
        <div className={styles.actions}>
          <button onClick={handleRedirect} className={styles.secondaryBtn}>
            Return to Public Site
          </button>
          <button onClick={onClose} className={styles.primaryBtn}>
            I Understand & Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
