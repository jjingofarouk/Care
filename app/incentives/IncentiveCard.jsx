// incentive/IncentiveCard.jsx
import React from 'react';
import styles from './IncentiveCard.module.css';

const IncentiveCard = ({ incentive }) => {
  return (
    <div className={styles.card}>
      <h3>{incentive.employeeName}</h3>
      <p>Incentive ID: {incentive.incentiveId}</p>
      <p>Amount: {incentive.amount}</p>
      <p>Date: {new Date(incentive.date).toLocaleDateString()}</p>
      <p>Type: {incentive.type}</p>
    </div>
  );
};

export default IncentiveCard;
