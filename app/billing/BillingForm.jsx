'use client';
import React, { useState } from 'react';
import styles from './BillingForm.module.css';
import { createBill } from './billingService';

export default function BillingForm({ patients, onSuccess }) {
  const [formData, setFormData] = useState({
    patientId: '',
    amount: '',
    status: 'PENDING',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBill({ ...formData, amount: parseFloat(formData.amount) });
      onSuccess();
      setFormData({ patientId: '', amount: '', status: 'PENDING' });
    } catch (err) {
      setError('Failed to create bill');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Patient</label>
        <select
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          required
        >
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label>Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          required
        />
      </div>
      <div className={styles.field}>
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>
        Create Bill
      </button>
    </form>
  );
}
