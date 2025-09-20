// mkt-referral/MktReferralForm.jsx
'use client';
import React, { useState } from 'react';
import styles from './MktReferralForm.module.css';
import { createReferral } from './mktReferralService';

const MktReferralForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    referralId: '',
    referredBy: '',
    referredTo: '',
    date: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createReferral(formData);
      alert('Referral created');
    } catch (error) {
      alert('Error creating referral');
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
        name="referralId"
        placeholder="Referral ID"
        value={formData.referralId}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="referredBy"
        placeholder="Referred By"
        value={formData.referredBy}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="referredTo"
        placeholder="Referred To"
        value={formData.referredTo}
        onChange={handleChange}
        required
      />
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

export default MktReferralForm;
