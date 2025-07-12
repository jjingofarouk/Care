
// SearchBar.jsx
import React, { useState } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search by patient or doctor name..."
        value={query}
        onChange={handleChange}
        className={styles.input}
      />
    </div>
  );
}
