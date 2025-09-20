'use client';
import React from 'react';
import styles from './CssdCard.module.css';

export default function CssdCard({ record }) {
  const { id, itemName, sterilizationDate, status } = record;
  const formattedDate = new Date(sterilizationDate).toLocaleString();

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>CSSD Record #{id}</h3>
      <p>
        <strong>Item:</strong> {itemName}
      </p>
      <p>
        <strong>Sterilization Date:</strong> {formattedDate}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
    </div>
  );
}
