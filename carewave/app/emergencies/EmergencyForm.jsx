// emergency/EmergencyForm.jsx
"use client" ;

import React, { useState } from 'react';
import styles from './EmergencyForm.module.css';
import { createEmergency } from './emergencyService';

const EmergencyForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    caseId: '',
    severity: '',
    status: '',
    admissionDate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEmergency(formData);
      alert('Emergency case created');
    } catch (error) {
      alert('Error creating emergency case');
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
      <select
        name="severity"
        value={formData.severity}
        onChange={handleChange}
        required
      >
        <option value="">Select Severity</option>
        <option value="Critical">Critical</option>
        <option value="Urgent">Urgent</option>
        <option value="Stable">Stable</option>
      </select>
      <input
        type="text"
        name="status"
        placeholder="Status"
        value={formData.status}
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
      <button type="submit">Submit</button>
    </form>
  );
};

export default EmergencyForm;
