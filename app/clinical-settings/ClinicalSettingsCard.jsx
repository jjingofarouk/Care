'use client';
import React from 'react';
import styles from './ClinicalSettingsCard.module.css';

export default function ClinicalSettingsCard({ setting }) {
  const { id, key, value, updatedAt } = setting;
  const formattedDate = new Date(updatedAt).toLocaleString();

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Setting #{id}</h3>
      <p>
        <strong>Key:</strong> {key}
      </p>
      <p>
        <strong>Value:</strong> {value}
      </p>
      <p>
        <strong>Updated:</strong> {formattedDate}
      </p>
    </div>
  );
}
