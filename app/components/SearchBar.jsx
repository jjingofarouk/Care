"use client";

import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
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
    <Box component="form" className={styles.searchContainer} onSubmit={handleSubmit}>
      <TextField
        type="text"
        className={styles.searchInput}
        placeholder="Search by name, ID, or diagnosis..."
        value={query}
        onChange={handleChange}
        aria-label="Search records"
        fullWidth
        variant="outlined"
      />
      <Button
        type="submit"
        className={styles.searchButton}
        onClick={handleSubmit}
        aria-label="Search"
        variant="contained"
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;