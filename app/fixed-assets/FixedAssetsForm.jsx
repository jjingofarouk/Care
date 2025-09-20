"use client";

// fixed-assets/FixedAssetsForm.jsx
import React, { useState } from 'react';
import styles from './FixedAssetsForm.module.css';
import { createFixedAsset } from './fixedAssetsService';

const FixedAssetsForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    assetId: '',
    type: '',
    purchaseDate: '',
    status: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFixedAsset(formData);
      alert('Asset created');
    } catch (error) {
      alert('Error creating asset');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Asset Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="assetId"
        placeholder="Asset ID"
        value={formData.assetId}
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
      <input
        type="date"
        name="purchaseDate"
        value={formData.purchaseDate}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="status"
        placeholder="Status"
        value={formData.status}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default FixedAssetsForm;
