// operation-theatre/OperationTheatreList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './OperationTheatreList.module.css';
import { getSurgeries } from './operationTheatreService';
import OperationTheatreCard from './OperationTheatreCard';

const OperationTheatreList = () => {
  const [surgeries, setSurgeries] = useState([]);

  useEffect(() => {
    const fetchSurgeries = async () => {
      try {
        const data = await getSurgeries();
        setSurgeries(data);
      } catch (error) {
        console.error('Error fetching surgeries:', error);
      }
    };
    fetchSurgeries();
  }, []);

  return (
    <div className={styles.list}>
      {surgeries.map((surgery) => (
        <OperationTheatreCard key={surgery.id} surgery={surgery} />
      ))}
    </div>
  );
};

export default OperationTheatreList;
