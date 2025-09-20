'use client';
import React from 'react';
import styles from './DashboardChart.module.css';

export default function DashboardChart({ data }) {
  return (
    <div className={styles.chart}>
      <h3 className={styles.title}>Appointments Overview</h3>
      <div className={styles.placeholder}>
        Chart Placeholder: {JSON.stringify(data)}
      </div>
    </div>
  );
}
