// vaccination/VaccinationList.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './VaccinationList.module.css';
import { getVaccinations } from './vaccinationService';
import VaccinationCard from './VaccinationCard';

const VaccinationList = () => {
  const [vaccinations, setVaccinations] = useState([]);

  useEffect(() => {
    const fetchVaccinations = async () => {
      try {
        const data = await getVaccinations();
        setVaccinations(data);
      } catch (error) {
        console.error('Error fetching vaccinations:', error);
      }
    };
    fetchVaccinations();
  }, []);

  return (
    <div className={styles.list}>
      {vaccinations.map((vaccination) => (
        <VaccinationCard key={vaccination.id} vaccination={vaccination} />
      ))}
    </div>
  );
};

export default VaccinationList;
