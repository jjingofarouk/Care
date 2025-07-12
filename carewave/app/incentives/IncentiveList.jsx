"use client";


// incentive/IncentiveList.jsx
import React, { useEffect, useState } from 'react';
import styles from './IncentiveList.module.css';
import { getIncentives } from './incentiveService';
import IncentiveCard from './IncentiveCard';

const IncentiveList = () => {
  const [incentives, setIncentives] = useState([]);

  useEffect(() => {
    const fetchIncentives = async () => {
      try {
        const data = await getIncentives();
        setIncentives(data);
      } catch (error) {
        console.error('Error fetching incentives:', error);
      }
    };
    fetchIncentives();
  }, []);

  return (
    <div className={styles.list}>
      {incentives.map((incentive) => (
        <IncentiveCard key={incentive.id} incentive={incentive} />
      ))}
    </div>
  );
};

export default IncentiveList;
