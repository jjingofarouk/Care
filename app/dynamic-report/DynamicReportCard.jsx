'use client';
import React from 'react';
import styles from './DynamicReportCard.module.css';

export default function DynamicReportCard({ report }) {
  const { id, name, createdAt } = report;
  const formattedDate = new Date(createdAt).toLocaleString();

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Report #{id}</h3>
      <p>
        <strong>Name:</strong> {name}
      </p>
      <p>
        <strong>Created:</strong> {formattedDate}
      </p>
    </div>
  );
}
