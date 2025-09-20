// reports/ReportCard.jsx
'use client';
import React from 'react';
import styles from './ReportCard.module.css';

const ReportCard = ({ report }) => {
  return (
    <div className={styles.card}>
      <h3>{report.title}</h3>
      <p>Report ID: {report.reportId}</p>
      <p>Type: {report.type}</p>
      <p>
        Generated Date: {new Date(report.generatedDate).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ReportCard;
