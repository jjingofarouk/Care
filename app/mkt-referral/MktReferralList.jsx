// mkt-referral/MktReferralList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './MktReferralList.module.css';
import { getReferrals } from './mktReferralService';
import MktReferralCard from './MktReferralCard';

const MktReferralList = () => {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const data = await getReferrals();
        setReferrals(data);
      } catch (error) {
        console.error('Error fetching referrals:', error);
      }
    };
    fetchReferrals();
  }, []);

  return (
    <div className={styles.list}>
      {referrals.map((referral) => (
        <MktReferralCard key={referral.id} referral={referral} />
      ))}
    </div>
  );
};

export default MktReferralList;
