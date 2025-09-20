"use client";

import React from 'react';
import { Box } from '@mui/material';
import DashboardOverview from './DashboardOverview';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  return (
    <Box className={styles.container}>
      <DashboardOverview />
    </Box>
  );
}