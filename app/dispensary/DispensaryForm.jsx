'use client';
import React, { useState } from 'react';
import styles from './DispensaryForm.module.css';
import { createDispensaryRecord } from './dispensaryService';

export default function DispensaryForm({ medications, onSuccess }) {
  const [formData, setFormData] = useState({
    medicationId: '',
    quantity: '',
    dispensedDate: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDispensaryRecord({
        ...formData,
        quantity: parseInt(formData.quantity),
      });
      onSuccess();
      setFormData({ medicationId: '', quantity: '', dispensedDate: '' });
    } catch (err) {
      setError('Failed to create dispensary record');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Medication</label>
        <select
          name="medicationId"
          value={formData.medicationId}
          onChange={handleChange}
          required
        >
          <option value="">Select Medication</option>
          {medications.map((medication) => (
            <option key={medication.id} value={medication.id}>
              {medication.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label>Dispensed Date</label>
        <input
          type="datetime-local"
          name="dispensedDate"
          value={formData.dispensedDate}
          onChange={handleChange}
          required
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>
        Create Record
      </button>
    </form>
  );
}
