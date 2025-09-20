'use client';
import React, { useState } from 'react';
import styles from './ClinicalSettingsForm.module.css';
import { createClinicalSetting } from './clinicalSettingsService';

export default function ClinicalSettingsForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    key: '',
    value: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClinicalSetting(formData);
      onSuccess();
      setFormData({ key: '', value: '' });
    } catch (err) {
      setError('Failed to create clinical setting');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Key</label>
        <input
          type="text"
          name="key"
          value={formData.key}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label>Value</label>
        <input
          type="text"
          name="value"
          value={formData.value}
          onChange={handleChange}
          required
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>
        Create Setting
      </button>
    </form>
  );
}
