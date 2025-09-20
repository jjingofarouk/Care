'use client';
import React from 'react';
import styles from './ClaimCard.module.css';

export default function ClaimCard({ claim }) {
  const { id, patient, amount, status, createdAt } = claim;
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Claim #{id}</h3>
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
