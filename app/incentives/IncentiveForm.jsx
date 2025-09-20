
"use client";

// incentive/IncentiveForm.jsx
import React, { useState } from 'react';
import styles from './IncentiveForm.module.css';
import { createIncentive } from './incentiveService';

const IncentiveForm = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    incentiveId: '',
    amount: '',
    date: '',
    type: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createIncentive(formData);
      alert('Incentive created');
    } catch (error) {
      alert('Error creating incentive');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="employeeName"
        placeholder="Employee Name"
        value={formData.employeeName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="incentiveId"
        placeholder="Incentive ID"
        value={formData.incentiveId}
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
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="type"
        placeholder="Type"
        value={formData.type}
        onChange={handleChange}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default IncentiveForm;
