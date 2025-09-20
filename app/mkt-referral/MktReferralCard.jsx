// mkt-referral/MktReferralCard.jsx
'use client';
import React from 'react';
import styles from './MktReferralCard.module.css';

const MktReferralCard = ({ referral }) => {
  return (
    <div className={styles.card}>
      <h3>{referral.patientName}</h3>
      <p>Referral ID: {referral.referralId}</p>
      <p>Referred By: {referral.referredBy}</p>
      <p>Referred To: {referral.referredTo}</p>
      <p>Date: {new Date(referral.date).toLocaleDateString()}</p>
    </div>
  );
};

export default MktReferralCard;
