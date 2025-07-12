"use client";

import React, { useState, useEffect } from 'react';
import { Container, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import OutPatientRecords from './OutPatientRecords';
import InpatientRecords from './InpatientRecords';
import EmergencyRecords from './EmergencyRecords';
import { getPatients } from '../patients/patientService';
import styles from './ClinicalPage.module.css';

export default function ClinicalPage() {
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState('outpatient');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        console.error('Failed to fetch patients');
      }
    };
    fetchPatients();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      <Typography variant="h4" gutterBottom className={styles.title}>
        Clinical Records
      </Typography>
      <Paper elevation={3} className={styles.paper}>
        <Box className={styles.tabsWrapper}>
          <Tabs
            value={activeTab}
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
            <Tab label="Outpatient" value="outpatient" />
            <Tab label="Inpatient" value="inpatient" />
            <Tab label="ER" value="emergency" />
          </Tabs>
        </Box>
        <Box className={styles.content}>
          {activeTab === 'outpatient' && <OutPatientRecords patients={patients} />}
          {activeTab === 'inpatient' && <InpatientRecords patients={patients} />}
          {activeTab === 'emergency' && <EmergencyRecords patients={patients} />}
        </Box>
      </Paper>
    </Container>
  );
}