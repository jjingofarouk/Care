// settings/SettingsForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './SettingsForm.module.css';
import { updateSetting } from './settingsService';

const SettingsForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    settingId: '',
    value: '',
    category: '',
    lastUpdated: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSetting(formData);
      alert('Setting updated');
    } catch (error) {
      alert('Error updating setting');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Setting Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="settingId"
        placeholder="Setting ID"
        value={formData.settingId}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="value"
        placeholder="Value"
        value={formData.value}
        onChange={handleChange}
        required
      />
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        <option value="System">System</option>
        <option value="User">User</option>
        <option value="Security">Security</option>
      </select>
      <input
        type="date"
        name="lastUpdated"
        value={formData.lastUpdated}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SettingsForm;
