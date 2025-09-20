// procurement/ProcurementList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './ProcurementList.module.css';
import { getProcurements } from './procurementService';
import ProcurementCard from './ProcurementCard';

const ProcurementList = () => {
  const [procurements, setProcurements] = useState([]);

  useEffect(() => {
    const fetchProcurements = async () => {
      try {
        const data = await getProcurements();
        setProcurements(data);
      } catch (error) {
        console.error('Error fetching procurements:', error);
      }
    };
    fetchProcurements();
  }, []);

  return (
    <div className={styles.list}>
      {procurements.map((procurement) => (
        <ProcurementCard key={procurement.id} procurement={procurement} />
      ))}
    </div>
  );
};

export default ProcurementList;
