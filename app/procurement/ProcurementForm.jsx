// procurement/ProcurementForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './ProcurementForm.module.css';
import { createProcurement } from './procurementService';

const ProcurementForm = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    procurementId: '',
    quantity: '',
    supplier: '',
    date: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProcurement(formData);
      alert('Procurement created');
    } catch (error) {
      alert('Error creating procurement');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="itemName"
        placeholder="Item Name"
        value={formData.itemName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="procurementId"
        placeholder="Procurement ID"
        value={formData.procurementId}
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
        name="supplier"
        placeholder="Supplier"
        value={formData.supplier}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ProcurementForm;
