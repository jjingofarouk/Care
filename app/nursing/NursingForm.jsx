// nursing/NursingForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './NursingForm.module.css';
import { createNursingCare } from './nursingService';

const NursingForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    careId: '',
    status: '',
    date: '',
    nurseName: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNursingCare(formData);
      alert('Nursing care created');
    } catch (error) {
      alert('Error creating nursing care');
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
        name="careId"
        placeholder="Care ID"
        value={formData.careId}
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
        <option value="Ongoing">Ongoing</option>
        <option value="Completed">Completed</option>
        <option value="Discharged">Discharged</option>
      </select>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="nurseName"
        placeholder="Nurse Name"
        value={formData.nurseName}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default NursingForm;
