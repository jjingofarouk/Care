'use client';
import React, { useState, useEffect } from 'react';
import styles from './DynamicReportList.module.css';
import DynamicReportCard from './DynamicReportCard';
import { getDynamicReports } from './dynamicReportService';

export default function DynamicReportList() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getDynamicReports();
        setReports(data);
      } catch (err) {
        setError('Failed to fetch reports');
      }
    };
    fetchReports();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dynamic Reports</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {reports.map((report) => (
          <DynamicReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
