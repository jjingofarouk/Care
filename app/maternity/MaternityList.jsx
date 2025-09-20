// maternity/MaternityList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './MaternityList.module.css';
import { getMaternities } from './maternityService';
import MaternityCard from './MaternityCard';

const MaternityList = () => {
  const [maternities, setMaternities] = useState([]);

  useEffect(() => {
    const fetchMaternities = async () => {
      try {
        const data = await getMaternities();
        setMaternities(data);
      } catch (error) {
        console.error('Error fetching maternities:', error);
      }
    };
    fetchMaternities();
  }, []);

  return (
    <div className={styles.list}>
      {maternities.map((maternity) => (
        <MaternityCard key={maternity.id} maternity={maternity} />
      ))}
    </div>
  );
};

export default MaternityList;
