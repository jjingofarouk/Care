// vaccination/VaccinationCard.jsx
'use client';
import React from 'react';
import styles from './VaccinationCard.module.css';

const VaccinationCard = ({ vaccination }) => {
  return (
    <div className={styles.card}>
      <h3>{vaccination.patientName}</h3>
      <p>Vaccination ID: {vaccination.vaccinationId}</p>
      <p>Vaccine: {vaccination.vaccine}</p>
      <p>Status: {vaccination.status}</p>
      <p>Date: {new Date(vaccination.date).toLocaleDateString()}</p>
    </div>
  );
};

export default VaccinationCard;
