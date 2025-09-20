
// patient/PatientNotification.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './PatientNotification.module.css';
import { getPatients } from './patientService';

const PatientNotification = () => {
  const [recentPatients, setRecentPatients] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentPatients = async () => {
      try {
        const data = await getPatients();
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const recent = data.filter(
          (patient) => new Date(patient.registrationDate) >= oneWeekAgo
        );
        setRecentPatients(recent);
      } catch (err) {
        setError('Failed to fetch recent patients');
      }
    };
    fetchRecentPatients();
  }, []);

  if (!recentPatients.length && !error) return null;

  return (
    <div className={styles.banner}>
      {error && <p className={styles.error}>{error}</p>}
      {recentPatients.map((patient) => (
        <p key={patient.id}>
          New Patient: {patient.name} (ID: {patient.patientId}) registered on{' '}
          {new Date(patient.registrationDate).toLocaleDateString()}
        </p>
      ))}
    </div>
  );
};

export default PatientNotification;
