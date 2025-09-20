// utilities/UtilitiesList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './UtilitiesList.module.css';
import { getUtilities } from './utilitiesService';
import UtilitiesCard from './UtilitiesCard';

const UtilitiesList = () => {
  const [utilities, setUtilities] = useState([]);

  useEffect(() => {
    const fetchUtilities = async () => {
      try {
        const data = await getUtilities();
        setUtilities(data);
      } catch (error) {
        console.error('Error fetching utilities:', error);
      }
    };
    fetchUtilities();
  }, []);

  return (
    <div className={styles.list}>
      {utilities.map((utility) => (
        <UtilitiesCard key={utility.id} utility={utility} />
      ))}
    </div>
  );
};

export default UtilitiesList;
