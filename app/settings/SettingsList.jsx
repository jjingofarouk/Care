// settings/SettingsList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './SettingsList.module.css';
import { getSettings } from './settingsService';
import SettingsCard from './SettingsCard';

const SettingsList = () => {
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className={styles.list}>
      {settings.map((setting) => (
        <SettingsCard key={setting.id} setting={setting} />
      ))}
    </div>
  );
};

export default SettingsList;
