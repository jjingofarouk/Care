'use client';
import React, { useState } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import DoctorList from './DoctorList';
import DoctorForm from './DoctorForm';
import ErrorBoundary from '../components/ErrorBoundary';
import styles from './page.module.css';

const DoctorPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue !== 1) {
      setSelectedDoctor(null);
    }
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setTabValue(1);
  };

  const handleDoctorSelect = (doctorId) => {
    console.log('Selected doctor ID:', doctorId);
  };

  return (
    <ErrorBoundary>
      <Container maxWidth="xl" className={styles.container}>
        <Typography variant="h4" gutterBottom className={styles.title}>
          Doctor Management
        </Typography>
        <Paper elevation={3} className={styles.paper}>
          <Box className={styles.tabsWrapper}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              className={styles.tabs}
              sx={{
                '& .MuiTabs-flexContainer': {
                  flexWrap: 'nowrap',
                },
                '& .MuiTab-root': {
                  minWidth: { xs: 100, sm: 120 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                },
              }}
            >
              <Tab label="Doctor List" />
              <Tab label={selectedDoctor ? 'Edit Doctor' : 'Add Doctor'} />
            </Tabs>
          </Box>
          <Box className={styles.tabContent}>
            {tabValue === 0 && (
              <DoctorList onEdit={handleEdit} onSelect={handleDoctorSelect} />
            )}
            {tabValue === 1 && (
              <DoctorForm
                doctor={selectedDoctor}
                onSave={() => setTabValue(0)}
                onCancel={() => setTabValue(0)}
              />
            )}
          </Box>
        </Paper>
      </Container>
    </ErrorBoundary>
  );
};

export default DoctorPage;