

// patient/PatientDetails.jsx
'use client';
import React from 'react';
import styles from './PatientDetails.module.css';
import Image from 'next/image';

const PatientDetails = ({ patient, onBack }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Patient Details</h2>
      <div className={styles.card}>
        <div className={styles.header}>
          {patient.photo ? (
            <Image
              src={patient.photo}
              alt={`${patient.name}'s photo`}
              width={100}
              height={100}
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
        {patient.nextOfKinName && <p><strong>Next of Kin:</strong> {patient.nextOfKinName} ({patient.nextOfKinContact})</p>}
        {patient.emergencyContactName && <p><strong>Emergency Contact:</strong> {patient.emergencyContactName} ({patient.emergencyContactPhone})</p>}
        <button className={styles.backButton} onClick={onBack}>
          Back to List
        </button>
      </div>
    </div>
  );
};

export default PatientDetails;
