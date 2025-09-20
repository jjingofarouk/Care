// verification/VerificationForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './VerificationForm.module.css';
import { createVerification } from './verificationService';

const VerificationForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    verificationId: '',
    type: '',
    status: '',
    date: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVerification(formData);
      alert('Verification recorded');
    } catch (error) {
      alert('Error recording verification');
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
        name="verificationId"
        placeholder="Verification ID"
        value={formData.verificationId}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="type"
        placeholder="Verification Type"
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
        <option value="Verified">Verified</option>
        <option value="Pending">Pending</option>
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

export default VerificationForm;
