// reports/ReportList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './ReportList.module.css';
import { getReports } from './reportService';
import ReportCard from './ReportCard';

const ReportList = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className={styles.list}>
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
};

export default ReportList;
