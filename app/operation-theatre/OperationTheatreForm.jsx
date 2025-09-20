// operation-theatre/OperationTheatreForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './OperationTheatreForm.module.css';
import { createSurgery } from './operationTheatreService';

const OperationTheatreForm = () => {
  const [formData, setFormData] = useState({
    procedure: '',
    surgeryId: '',
    patientName: '',
    status: '',
    date: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSurgery(formData);
      alert('Surgery scheduled');
    } catch (error) {
      alert('Error scheduling surgery');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="procedure"
        placeholder="Procedure"
        value={formData.procedure}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="surgeryId"
        placeholder="Surgery ID"
        value={formData.surgeryId}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="patientName"
        placeholder="Patient Name"
        value={formData.patientName}
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
        <option value="Scheduled">Scheduled</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
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

export default OperationTheatreForm;
