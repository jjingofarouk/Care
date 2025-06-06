"use client";
import React, { useState, useEffect } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import PatientForm from './PatientForm';
import HistoryTakingForm from './HistoryTakingForm';
import { getPatients } from './patientService';
import styles from './PatientPage.module.css'; // Import new CSS module

export default function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsData = await getPatients();
        setPatients(patientsData);
      } catch (err) {
        console.error('Failed to fetch patients', err);
      }
    };
    fetchData();
  }, [refreshKey]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue !== 1) {
      setSelectedPatient(null);
    }
  };

  const handleSuccess = () => {
    setSelectedPatient(null);
    setTabValue(0);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setTabValue(1);
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Patient Management
      </Typography>
      <Paper className={styles.paper}>
        <Box className={styles.tabsWrapper}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            className={styles.tabs}
          >
            <Tab label={selectedPatient ? 'Edit Patient' : 'Add Patient'} className={styles.tab} />
            <Tab label="History Taking" className={styles.tab} />
          </Tabs>
        </Box>
        <Box className={styles.content}>
          {tabValue === 0 && (
            <PatientForm patient={selectedPatient} onSuccess={handleSuccess} />
          )}
          {tabValue === 1 && (
            <HistoryTakingForm patients={patients} onSuccess={handleSuccess} />
          )}
        </Box>
      </Paper>
    </Container>
  );
}