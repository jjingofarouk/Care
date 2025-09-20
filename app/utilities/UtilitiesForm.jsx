// utilities/UtilitiesForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './UtilitiesForm.module.css';
import { createUtility } from './utilitiesService';

const UtilitiesForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    utilityId: '',
    type: '',
    status: '',
    lastUpdated: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUtility(formData);
      alert('Utility created');
    } catch (error) {
      alert('Error creating utility');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Utility Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="utilityId"
        placeholder="Utility ID"
        value={formData.utilityId}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="type"
        placeholder="Type"
        value={formData.type}
        onChange={handleChange}
        required
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <option value="">Select Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
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

export default UtilitiesForm;
