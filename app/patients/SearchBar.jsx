// components/SearchBar.jsx
'use client';
import React, { useState } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(query);
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search by name or patient ID..."
        value={query}
        onChange={handleChange}
        aria-label="Search patients"
      />
      <button type="submit" className={styles.searchButton} aria-label="Search">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
