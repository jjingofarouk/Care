'use client';
import React, { useState, useEffect } from 'react';
import styles from './DispensaryList.module.css';
import DispensaryCard from './DispensaryCard';
import { getDispensaryRecords } from './dispensaryService';

export default function DispensaryList() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getDispensaryRecords();
        setRecords(data);
      } catch (err) {
        setError('Failed to fetch dispensary records');
      }
    };
    fetchRecords();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Dispensary Records</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {records.map((record) => (
          <DispensaryCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}
