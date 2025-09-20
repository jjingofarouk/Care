'use client';
import React, { useState, useEffect } from 'react';
import styles from './ClinicalSettingsList.module.css';
import ClinicalSettingsCard from './ClinicalSettingsCard';
import { getClinicalSettings } from './clinicalSettingsService';

export default function ClinicalSettingsList() {
  const [settings, setSettings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getClinicalSettings();
        setSettings(data);
      } catch (err) {
        setError('Failed to fetch clinical settings');
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Clinical Settings</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {settings.map((setting) => (
          <ClinicalSettingsCard key={setting.id} setting={setting} />
        ))}
      </div>
    </div>
  );
}
