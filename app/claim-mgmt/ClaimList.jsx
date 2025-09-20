'use client';
import React, { useState, useEffect } from 'react';
import styles from './ClaimList.module.css';
import ClaimCard from './ClaimCard';
import { getClaims } from './claimService';

export default function ClaimList() {
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await getClaims();
        setClaims(data);
      } catch (err) {
        setError('Failed to fetch claims');
      }
    };
    fetchClaims();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Claim Records</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {claims.map((claim) => (
          <ClaimCard key={claim.id} claim={claim} />
        ))}
      </div>
    </div>
  );
}
