"use client";
import React, { useState, useEffect } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import PatientForm from './PatientForm';
import PatientList from './PatientList';
import MedicalRecordsList from './MedicalRecordsList';
import { getPatients } from './patientService';
import { getMedicalRecords } from './medicalRecordsService';
import styles from './PatientPage.module.css';

export default function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, recordsData] = await Promise.all([
          getPatients(),
          getMedicalRecords(),
        ]);
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
            <Tab label="All Patients" className={styles.tab} />
            <Tab label={selectedPatient ? 'Edit Patient' : 'Add Patient'} className={styles.tab} />
            <Tab label="Medical Records" className={styles.tab} />
          </Tabs>
        </Box>
        <Box className={styles.content}>
          {tabValue === 0 && (
            <PatientList
              patients={patients}
              onSuccess={handleSuccess}
              onEdit={handleEdit}
            />
          )}
          {tabValue === 1 && (
            <PatientForm
              patient={selectedPatient}
              onSubmit={handleSuccess}
            />
          )}
          {tabValue === 2 && (
            <MedicalRecordsList
              medicalRecords={medicalRecords}
              patients={patients}
              onSuccess={handleSuccess}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
}