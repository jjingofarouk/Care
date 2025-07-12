"use client";
import React from 'react';
import { Box } from '@mui/material';
import styles from './layout.module.css';

const PatientLayout = ({ children }) => {
  return (
    <Box className={styles.container}>
      {children}
    </Box>
  );
};

export default PatientLayout;