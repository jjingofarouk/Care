// maternity/MaternityForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './MaternityForm.module.css';
import { createMaternity } from './maternityService';

const MaternityForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    caseId: '',
    admissionDate: '',
    status: '',
    expectedDelivery: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMaternity(formData);
      alert('Maternity case created');
    } catch (error) {
      alert('Error creating maternity case');
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
        name="caseId"
        placeholder="Case ID"
        value={formData.caseId}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="admissionDate"
        value={formData.admissionDate}
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
        <option value="Discharged">Discharged</option>
        <option value="Transferred">Transferred</option>
      </select>
      <input
        type="date"
        name="expectedDelivery"
        value={formData.expectedDelivery}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default MaternityForm;
