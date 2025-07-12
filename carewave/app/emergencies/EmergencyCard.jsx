// emergency/EmergencyCard.jsx
import React from 'react';
import styles from './EmergencyCard.module.css';

const EmergencyCard = ({ emergency }) => {
  return (
    <div className={styles.card}>
      <h3>{emergency.patientName}</h3>
      <p>Case ID: {emergency.caseId}</p>
      <p>Severity: {emergency.severity}</p>
      <p>Status: {emergency.status}</p>
      <p>Admitted: {new Date(emergency.admissionDate).toLocaleDateString()}</p>
    </div>
  );
};

export default EmergencyCard;
