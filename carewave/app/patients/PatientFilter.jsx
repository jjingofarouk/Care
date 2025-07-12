
// patient/PatientFilter.jsx
'use client';
import React, { useState } from 'react';
import styles from './PatientFilter.module.css';

const PatientFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    gender: '',
    minAge: '',
    maxAge: '',
    referralCenter: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <form className={styles.filterForm} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="gender">Gender</label>
        <select id="gender" name="gender" value={filters.gender} onChange={handleChange}>
          <option value="">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="minAge">Min Age</label>
        <input
          id="minAge"
          type="number"
          name="minAge"
          placeholder="Min Age"
          value={filters.minAge}
          onChange={handleChange}
          min="0"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="maxAge">Max Age</label>
        <input
          id="maxAge"
          type="number"
          name="maxAge"
          placeholder="Max Age"
          value={filters.maxAge}
          onChange={handleChange}
          min="0"
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="referralCenter">Referral Center</label>
        <input
          id="referralCenter"
          type="text"
          name="referralCenter"
          placeholder="Referral Center"
          value={filters.referralCenter}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className={styles.button}>Apply Filters</button>
    </form>
  );
};

export default PatientFilter;
