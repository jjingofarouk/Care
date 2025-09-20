// verification/VerificationCard.jsx
'use client';
import React from 'react';
import styles from './VerificationCard.module.css';

const VerificationCard = ({ verification }) => {
  return (
    <div className={styles.card}>
      <h3>{verification.patientName}</h3>
      <p>Verification ID: {verification.verificationId}</p>
      <p>Type: {verification.type}</p>
      <p>Status: {verification.status}</p>
      <p>Date: {new Date(verification.date).toLocaleDateString()}</p>
    </div>
  );
};

export default VerificationCard;
