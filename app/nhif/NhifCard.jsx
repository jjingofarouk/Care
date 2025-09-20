// nhif/NhifCard.jsx
'use client';
import React from 'react';
import styles from './NhifCard.module.css';

const NhifCard = ({ claim }) => {
  return (
    <div className={styles.card}>
      <h3>{claim.patientName}</h3>
      <p>Claim ID: {claim.claimId}</p>
      <p>Amount: {claim.amount}</p>
      <p>Status: {claim.status}</p>
      <p>Date: {new Date(claim.date).toLocaleDateString()}</p>
    </div>
  );
};

export default NhifCard;
