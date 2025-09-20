'use client';
import React, { useState, useEffect } from 'react';
import styles from './CssdList.module.css';
import CssdCard from './CssdCard';
import { getCssdRecords } from './cssdService';

export default function CssdList() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getCssdRecords();
        setRecords(data);
      } catch (err) {
        setError('Failed to fetch CSSD records');
      }
    };
    fetchRecords();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>CSSD Records</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {records.map((record) => (
          <CssdCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}
