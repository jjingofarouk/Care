'use client';
import React from 'react';
import styles from './BillingCard.module.css';

export default function BillingCard({ bill }) {
  const { id, patient, amount, status, createdAt } = bill;
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Bill #{id}</h3>
      <p>
        <strong>Patient:</strong> {patient.name}
      </p>
      <p>
        <strong>Amount:</strong> ${amount.toFixed(2)}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
      <p>
        <strong>Created:</strong> {formattedDate}
      </p>
    </div>
  );
}
