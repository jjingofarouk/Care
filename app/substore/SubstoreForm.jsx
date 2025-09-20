// substore/SubstoreForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './SubstoreForm.module.css';
import { createSubstoreItem } from './substoreService';

const SubstoreForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    itemId: '',
    quantity: '',
    location: '',
    lastUpdated: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSubstoreItem(formData);
      alert('Substore item created');
    } catch (error) {
      alert('Error creating substore item');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Item Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="itemId"
        placeholder="Item ID"
        value={formData.itemId}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
      />
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

export default SubstoreForm;
