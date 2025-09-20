// settings/SettingsCard.jsx
'use client';
import React from 'react';
import styles from './SettingsCard.module.css';

const SettingsCard = ({ setting }) => {
  return (
    <div className={styles.card}>
      <h3>{setting.name}</h3>
      <p>Setting ID: {setting.settingId}</p>
      <p>Value: {setting.value}</p>
      <p>Category: {setting.category}</p>
      <p>Last Updated: {new Date(setting.lastUpdated).toLocaleDateString()}</p>
    </div>
  );
};

export default SettingsCard;
