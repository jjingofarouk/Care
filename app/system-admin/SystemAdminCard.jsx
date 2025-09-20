// system-admin/SystemAdminCard.jsx
'use client';
import React from 'react';
import styles from './SystemAdminCard.module.css';

const SystemAdminCard = ({ admin }) => {
  return (
    <div className={styles.card}>
      <h3>{admin.name}</h3>
      <p>Admin ID: {admin.adminId}</p>
      <p>Role: {admin.role}</p>
      <p>Email: {admin.email}</p>
      <p>Last Updated: {new Date(admin.lastUpdated).toLocaleDateString()}</p>
    </div>
  );
};

export default SystemAdminCard;
