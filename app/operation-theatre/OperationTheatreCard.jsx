// operation-theatre/OperationTheatreCard.jsx
'use client';
import React from 'react';
import styles from './OperationTheatreCard.module.css';

const OperationTheatreCard = ({ surgery }) => {
  return (
    <div className={styles.card}>
      <h3>{surgery.procedure}</h3>
      <p>Surgery ID: {surgery.surgeryId}</p>
      <p>Patient: {surgery.patientName}</p>
      <p>Status: {surgery.status}</p>
      <p>Date: {new Date(surgery.date).toLocaleDateString()}</p>
    </div>
  );
};

export default OperationTheatreCard;
