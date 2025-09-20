'use client';
import React, { useState, useEffect } from 'react';
import styles from './BillingList.module.css';
import BillingCard from './BillingCard';
import { getBills } from './billingService';

export default function BillingList() {
  const [bills, setBills] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await getBills();
        setBills(data);
      } catch (err) {
        setError('Failed to fetch bills');
      }
    };
    fetchBills();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Billing Records</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {bills.map((bill) => (
          <BillingCard key={bill.id} bill={bill} />
        ))}
      </div>
    </div>
  );
}
