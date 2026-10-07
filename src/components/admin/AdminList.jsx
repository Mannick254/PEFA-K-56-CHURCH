import React, { useState } from 'react';
import styles from '../../styles/AdminList.module.css';

const dummyAdmins = [
  { id: 1, email: 'admin1@church.org', permissions: ['Live Stream', 'Internal Data'] },
  { id: 2, email: 'admin2@church.org', permissions: ['Public Publishing', 'Content Pages'] },
  { id: 3, email: 'admin3@church.org', permissions: ['Church Department'] },
];

const AdminList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [admins, setAdmins] = useState(dummyAdmins);

  const handleRevokeAccess = (adminId) => {
    if (window.confirm("Are you sure you want to revoke this administrator's access? This action cannot be undone.")) {
      setAdmins(admins.filter(admin => admin.id !== adminId));
      console.log(`Revoked access for ID: ${adminId}`);
    }
  };

  if (!isOpen) {
    return (
      <div className={styles.container}>
        <button onClick={() => setIsOpen(true)} className={styles.toggleButton}>
          <span className={styles.icon}>⚙️</span> Manage Administrators
        </button>
      </div>
    );
  }

  return (
    <div className={styles.listWrapper}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title}>System Administrators</h2>
          <p className={styles.subtitle}>{admins.length} active administrators</p>
        </div>
        <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
          Done
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Administrator</th>
              <th>Access Level</th>
              <th className={styles.textRight}>Management</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td data-label="Administrator">
                  <div className={styles.adminInfo}>
                    <div className={styles.avatar}>{admin.email[0].toUpperCase()}</div>
                    <span className={styles.email}>{admin.email}</span>
                  </div>
                </td>
                <td data-label="Access Level">
                  <div className={styles.permissionsGrid}>
                    {admin.permissions.map(p => (
                      <span key={p} className={styles.permissionTag}>{p}</span>
                    ))}
                  </div>
                </td>
                <td data-label="Management" className={styles.textRight}>
                  <button 
                    onClick={() => handleRevokeAccess(admin.id)} 
                    className={styles.revokeBtn}
                  >
                    Revoke Access
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {admins.length === 0 && (
          <div className={styles.emptyState}>No administrators found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminList;