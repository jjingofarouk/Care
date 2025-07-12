"use client"; 
// emergency/EmergencyList.jsx
import React, { useEffect, useState } from 'react';
import styles from './EmergencyList.module.css';
import { getEmergencies } from './emergencyService';
import EmergencyCard from './EmergencyCard';

const EmergencyList = () => {
  const [emergencies, setEmergencies] = useState([]);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const data = await getEmergencies();
        setEmergencies(data);
      } catch (error) {
        console.error('Error fetching emergencies:', error);
      }
    };
    fetchEmergencies();
  }, []);

  return (
    <div className={styles.list}>
      {emergencies.map((emergency) => (
        <EmergencyCard key={emergency.id} emergency={emergency} />
      ))}
    </div>
  );
};

export default EmergencyList;
