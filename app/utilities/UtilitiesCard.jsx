// utilities/UtilitiesCard.jsx
'use client';
import React from 'react';
import styles from './UtilitiesCard.module.css';

const UtilitiesCard = ({ utility }) => {
  return (
    <div className={styles.card}>
      <h3>{utility.name}</h3>
      <p>Utility ID: {utility.utilityId}</p>
      <p>Type: {utility.type}</p>
      <p>Status: {utility.status}</p>
      <p>Last Updated: {new Date(utility.lastUpdated).toLocaleDateString()}</p>
    </div>
  );
};

export default UtilitiesCard;
