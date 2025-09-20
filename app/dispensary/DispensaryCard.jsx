'use client';
import React from 'react';
import styles from './DispensaryCard.module.css';

export default function DispensaryCard({ record }) {
  const { id, medication, quantity, dispensedDate } = record;
  const formattedDate = new Date(dispensedDate).toLocaleString();

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Dispensary Record #{id}</h3>
      <p>
        <strong>Medication:</strong> {medication.name}
      </p>
      <p>
        <strong>Quantity:</strong> {quantity}
      </p>
      <p>
        <strong>Dispensed:</strong> {formattedDate}
      </p>
    </div>
  );
}
