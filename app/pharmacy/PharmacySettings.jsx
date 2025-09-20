// pharmacy/PharmacySettings.jsx
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Switch, FormControlLabel } from '@mui/material';
import { updateSettings } from './pharmacyService';
import styles from './PharmacySettings.module.css';

const PharmacySettings = () => {
  const [settings, setSettings] = useState({
    lowStockThreshold: 50,
    autoReorder: false,
    notificationEmail: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    await updateSettings(settings);
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Settings</Typography>
      <Box className={styles.form}>
        <TextField
          label="Low Stock Threshold"
          name="lowStockThreshold"
          type="number"
          value={settings.lowStockThreshold}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.autoReorder}
              onChange={handleChange}
              name="autoReorder"
            />
          }
          label="Enable Auto-Reorder"
        />
        <TextField
          label="Notification Email"
          name="notificationEmail"
          value={settings.notificationEmail}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={handleSave}>
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default PharmacySettings;
