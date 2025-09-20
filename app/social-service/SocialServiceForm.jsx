// social-service/SocialServiceForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './SocialServiceForm.module.css';
import { createSocialService } from './socialServiceService';

const SocialServiceForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    serviceId: '',
    serviceType: '',
    status: '',
    date: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSocialService(formData);
      alert('Social service created');
    } catch (error) {
      alert('Error creating social service');
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
        name="serviceId"
        placeholder="Service ID"
        value={formData.serviceId}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="serviceType"
        placeholder="Service Type"
        value={formData.serviceType}
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

export default SocialServiceForm;
