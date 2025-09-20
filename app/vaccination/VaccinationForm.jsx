// vaccination/VaccinationForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './VaccinationForm.module.css';
import { createVaccination } from './vaccinationService';

const VaccinationForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    vaccinationId: '',
    vaccine: '',
    status: '',
    date: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVaccination(formData);
      alert('Vaccination recorded');
    } catch (error) {
      alert('Error recording vaccination');
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
        name="vaccinationId"
        placeholder="Vaccination ID"
        value={formData.vaccinationId}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="vaccine"
        placeholder="Vaccine"
        value={formData.vaccine}
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
        <option value="Administered">Administered</option>
        <option value="Scheduled">Scheduled</option>
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

export default VaccinationForm;
