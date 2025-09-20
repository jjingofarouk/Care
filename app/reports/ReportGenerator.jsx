// reports/ReportGenerator.jsx
'use client';
import React, { useState } from 'react';
import styles from './ReportGenerator.module.css';
import { generateReport } from './reportService';

const ReportGenerator = () => {
  const [formData, setFormData] = useState({
    title: '',
    reportId: '',
    type: '',
    generatedDate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await generateReport(formData);
      alert('Report generated');
    } catch (error) {
      alert('Error generating report');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Report Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="reportId"
        placeholder="Report ID"
        value={formData.reportId}
        onChange={handleChange}
        required
      />
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
      >
        <option value="">Select Type</option>
        <option value="Financial">Financial</option>
        <option value="Patient">Patient</option>
        <option value="Operational">Operational</option>
      </select>
      <input
        type="date"
        name="generatedDate"
        value={formData.generatedDate}
        onChange={handleChange}
        required
      />
      <button type="submit">Generate Report</button>
    </form>
  );
};

export default ReportGenerator;
