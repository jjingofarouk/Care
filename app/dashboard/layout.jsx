import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children }) {
  return (
    <Box className={styles.container}>
      <AppBar position="static" className={styles.header}>
        <Toolbar>
          <Typography variant="h6" className={styles.headerTitle}>
            HMS Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="main" className={styles.main}>
        {children}
      </Box>
    </Box>
  );
}