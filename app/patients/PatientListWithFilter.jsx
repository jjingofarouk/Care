// patient/PatientListWithFilter.jsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './PatientList.module.css';
import PatientCard from './PatientCard';
import PatientFilter from './PatientFilter';
import { getPatients } from './patientService';

const PatientListWithFilter = ({ onEdit, onViewHistory, searchQuery }) => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    gender: '',
    minAge: '',
    maxAge: '',
    referralCenter: '',
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        setError('Failed to fetch patients');
      }
    };
    fetchPatients();
  }, []);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      !searchQuery ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGender = !filters.gender || patient.gender === filters.gender;
    const matchesMinAge = !filters.minAge || patient.age >= Number(filters.minAge);
    const matchesMaxAge = !filters.maxAge || patient.age <= Number(filters.maxAge);
    const matchesReferral =
      !filters.referralCenter ||
      patient.referralCenter?.toLowerCase().includes(filters.referralCenter.toLowerCase());
    return matchesSearch && matchesGender && matchesMinAge && matchesMaxAge && matchesReferral;
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Patient List</h2>
      <PatientFilter onFilter={handleFilter} />
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {filteredPatients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onEdit={onEdit}
            onViewHistory={onViewHistory}
          />
        ))}
      </div>
    </div>
  );
};

export default PatientListWithFilter;