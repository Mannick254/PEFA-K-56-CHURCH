import React, { useState } from 'react';
import styles from '../../styles/CreateAdmin.module.css';

const allPermissions = [
  'Live Stream', 'Internal Data', 'Public Publishing', 
  'Content Pages', 'Church Department'
];

const CreateAdmin = () => {
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePermissionChange = (permission) => {
    setPermissions(prev => 
      prev.includes(permission) 
        ? prev.filter(p => p !== permission) 
        : [...prev, permission]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/createadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation.');
      }

      setMessage(data.message);
      setEmail('');
      setPermissions([]);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setMessage('');
    setError('');
  }

  if (!isOpen) {
    return (
      <div className={styles.container}>
        <button onClick={() => setIsOpen(true)} className={styles.toggleButton}>
          <span>+</span> Create New Administrator
        </button>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h2 className={styles.title}>New Administrator</h2>
            <p className={styles.subtitle}>Assign roles and access levels</p>
          </div>
          <button onClick={closeModal} className={styles.closeButton} aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="e.g. admin@church.org"
              className={styles.input} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className={styles.permissionsSection}>
            <h3 className={styles.permissionsTitle}>Assign Permissions (Coming Soon)</h3>
            <div className={styles.permissionsGrid}>
              {allPermissions.map(permission => (
                <label key={permission} className={styles.permissionItem}>
                  <input 
                    type="checkbox" 
                    checked={permissions.includes(permission)}
                    className={styles.checkbox} 
                    onChange={() => handlePermissionChange(permission)}
                    disabled // Disabled until backend is ready
                  />
                  <span className={styles.checkboxLabel}>{permission}</span>
                </label>
              ))}
            </div>
          </div>
          
          {message && <p className={styles.successMessage}>{message}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.actions}>
            <button 
              type="button" 
              onClick={closeModal} 
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className={styles.submitBtn}
            >
              {isSubmitting ? 'Sending Invitation...' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;