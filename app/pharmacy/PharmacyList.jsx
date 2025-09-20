

// pharmacy/PharmacyList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './PharmacyList.module.css';
import { getPrescriptions } from './pharmacyService';
import PharmacyCard from './PharmacyCard';

const PharmacyList = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await getPrescriptions();
        setPrescriptions(data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    };
    fetchPrescriptions();
  }, []);

  return (
    <div className={styles.list}>
      {prescriptions.map((prescription) => (
        <PharmacyCard key={prescription.id} prescription={prescription} />
      ))}
    </div>
  );
};

export default PharmacyList;