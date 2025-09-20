// nursing/NursingList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './NursingList.module.css';
import { getNursingCares } from './nursingService';
import NursingCard from './NursingCard';

const NursingList = () => {
  const [cares, setCares] = useState([]);

  useEffect(() => {
    const fetchCares = async () => {
      try {
        const data = await getNursingCares();
        setCares(data);
      } catch (error) {
        console.error('Error fetching nursing cares:', error);
      }
    };
    fetchCares();
  }, []);

  return (
    <div className={styles.list}>
      {cares.map((care) => (
        <NursingCard key={care.id} nursing={care} />
      ))}
    </div>
  );
};

export default NursingList;
