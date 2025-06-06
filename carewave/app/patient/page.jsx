"use client";
import React, { useState, useEffect } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import PatientList from './PatientList';
import MedicalRecordsList from './MedicalRecordsList';
import { getPatients, getMedicalRecords } from './patientService';
import styles from './PatientPage.module.css';

export default function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, recordsData] = await Promise.all([getPatients(), getMedicalRecords()]);
        setPatients(patientsData);
        setMedicalRecords(recordsData);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchData();
  }, [refreshKey]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
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
            <Tab label="All Patients" className={styles.tab} />
            <Tab label="Medical Records" className={styles.tab} />
          </Tabs>
        </Box>
        <Box className={styles.content}>
          {tabValue === 0 && (
            <PatientList
              key={refreshKey}
              patients={patients}
              onSuccess={handleSuccess}
            />
          )}
          {tabValue === 1 && (
            <MedicalRecordsList
              medicalRecords={medicalRecords}
              onSuccess={handleSuccess}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
}