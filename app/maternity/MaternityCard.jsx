// maternity/MaternityCard.jsx

// maternity/MaternityCard.jsx
'use client';
import React from 'react';
import styles from './MaternityCard.module.css';

const MaternityCard = ({ maternity }) => {
  return (
    <div className={styles.card}>
      <h3>{maternity.patientName}</h3>
      <p>Case ID: {maternity.caseId}</p>
      <p>
        Admission Date: {new Date(maternity.admissionDate).toLocaleDateString()}
      </p>
      <p>Status: {maternity.status}</p>
      <p>
        Expected Delivery:{' '}
        {new Date(maternity.expectedDelivery).toLocaleDateString()}
      </p>
    </div>
  );
};

export default MaternityCard;
