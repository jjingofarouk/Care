// nhif/NhifList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './NhifList.module.css';
import { getNhifClaims } from './nhifService';
import NhifCard from './NhifCard';

const NhifList = () => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const data = await getNhifClaims();
        setClaims(data);
      } catch (error) {
        console.error('Error fetching NHIF claims:', error);
      }
    };
    fetchClaims();
  }, []);

  return (
    <div className={styles.list}>
      {claims.map((claim) => (
        <NhifCard key={claim.id} claim={claim} />
      ))}
    </div>
  );
};

export default NhifList;
