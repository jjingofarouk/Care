// verification/VerificationList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './VerificationList.module.css';
import { getVerifications } from './verificationService';
import VerificationCard from './VerificationCard';

const VerificationList = () => {
  const [verifications, setVerifications] = useState([]);

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        const data = await getVerifications();
        setVerifications(data);
      } catch (error) {
        console.error('Error fetching verifications:', error);
      }
    };
    fetchVerifications();
  }, []);

  return (
    <div className={styles.list}>
      {verifications.map((verification) => (
        <VerificationCard key={verification.id} verification={verification} />
      ))}
    </div>
  );
};

export default VerificationList;
