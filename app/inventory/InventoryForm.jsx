"use client";

// inventory/InventoryForm.jsx
import React, { useState } from 'react';
import styles from './InventoryForm.module.css';
import { createInventoryItem } from './inventoryService';

const InventoryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    itemId: '',
    quantity: '',
    category: '',
    lastUpdated: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createInventoryItem(formData);
      alert('Inventory item created');
    } catch (error) {
      alert('Error creating inventory item');
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
        name="category"
        placeholder="Category"
        value={formData.category}
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

export default InventoryForm;
