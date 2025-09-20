// nursing/NursingCard.jsx
'use client';
import React from 'react';
import styles from './NursingCard.module.css';

const NursingCard = ({ nursing }) => {
  return (
    <div className={styles.card}>
      <h3>{nursing.patientName}</h3>
      <p>Care ID: {nursing.careId}</p>
      <p>Status: {nursing.status}</p>
      <p>Date: {new Date(nursing.date).toLocaleDateString()}</p>
      <p>Nurse: {nursing.nurseName}</p>
    </div>
  );
};

export default NursingCard;
