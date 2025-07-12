// patient/PatientCard.jsx
'use client';
import React from 'react';
import styles from './PatientCard.module.css';
import Image from 'next/image';

const PatientCard = ({ patient, onEdit, onViewHistory }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {patient.photo ? (
          <Image
            src={patient.photo}
            alt={`${patient.name}'s photo`}
            width={60}
            height={60}
            className={styles.photo}
          />
        ) : (
          <div className={styles.photoPlaceholder}>No Photo</div>
        )}
        <h3>{patient.name}</h3>
      </div>
      <p><strong>Patient ID:</strong> {patient.patientId}</p>
      <p><strong>Age:</strong> {patient.age}</p>
      <p><strong>Gender:</strong> {patient.gender}</p>
      <p><strong>Registration Date:</strong> {new Date(patient.registrationDate).toLocaleDateString()}</p>
      {patient.referralCenter && <p><strong>Referral Center:</strong> {patient.referralCenter}</p>}
      {patient.insuranceProvider && <p><strong>Insurance:</strong> {patient.insuranceProvider} ({patient.insuranceNumber})</p>}
      <div className={styles.buttonGroup}>
        <button
          className={styles.editButton}
          onClick={() => onEdit(patient)}
          aria-label={`Edit patient ${patient.patientId}`}
        >
          Edit
        </button>
        <button
          className={styles.historyButton}
          onClick={() => onViewHistory(patient.id)}
          aria-label={`View history for ${patient.patientId}`}
        >
          View History
        </button>
      </div>
    </div>
  );
};

export default PatientCard;
