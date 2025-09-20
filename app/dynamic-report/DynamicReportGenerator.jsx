'use client';
import React, { useState } from 'react';
import styles from './DynamicReportGenerator.module.css';
import { createDynamicReport } from './dynamicReportService';

export default function DynamicReportGenerator({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    query: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDynamicReport(formData);
      onSuccess();
      setFormData({ name: '', query: '' });
    } catch (err) {
      setError('Failed to create report');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Report Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label>Query</label>
        <textarea
          name="query"
          value={formData.query}
          onChange={handleChange}
          required
        />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.button}>
        Generate Report
      </button>
    </form>
  );
}
