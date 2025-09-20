
"use client";

// laboratory/LaboratoryList.jsx
import React, { useEffect, useState } from 'react';
import styles from './LaboratoryList.module.css';
import { getLaboratoryTests } from './laboratoryService';
import LaboratoryCard from './LaboratoryCard';

const LaboratoryList = () => {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await getLaboratoryTests();
        setTests(data);
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };
    fetchTests();
  }, []);

  return (
    <div className={styles.list}>
      {tests.map((test) => (
        <LaboratoryCard key={test.id} test={test} />
      ))}
    </div>
  );
};

export default LaboratoryList;
