// nhif/NhifForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './NhifForm.module.css';
import { createNhifClaim } from './nhifService';

const NhifForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    claimId: '',
    amount: '',
    status: '',
    date: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNhifClaim(formData);
      alert('NHIF claim created');
    } catch (error) {
      alert('Error creating NHIF claim');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="patientName"
        placeholder="Patient Name"
        value={formData.patientName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="claimId"
        placeholder="Claim ID"
        value={formData.claimId}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
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
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
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

export default NhifForm;
