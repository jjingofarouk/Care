'use client';
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Alert, Tabs, Tab } from '@mui/material';
import CssdInstrumentList from './CssdInstrumentList';
import CssdRecordList from './CssdRecordList';
import CssdRequisitionList from './CssdRequisitionList';
import CssdLogList from './CssdLogList';
import { getInstruments } from './cssdService';
import styles from './page.module.css';

export default function CssdPage() {
  const [tabValue, setTabValue] = useState(0);
  const [instruments, setInstruments] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    async function fetchData() {
      setErrors([]);
      try {
        const instrumentData = await getInstruments().catch((err) => {
          setErrors((prev) => [...prev, `Instruments: ${err.response?.data?.details || err.message}`]);
          return [];
        });
        setInstruments(instrumentData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrors((prev) => [...prev, 'General: Failed to fetch data. Please try again later.']);
      }
    }
    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box className={styles.container}>
      <Container className={styles.contentBox}>
        <Typography variant="h4" className={styles.mainTitle}>
          Central Sterile Services Department (CSSD)
        </Typography>
        {errors.length > 0 && (
          <Box className={styles.errorContainer}>
            {errors.map((error, index) => (
              <Alert key={index} severity="error" className={styles.errorAlert}>
                {error}
              </Alert>
            ))}
          </Box>
        )}
        {instruments.length === 0 && errors.length === 0 && (
          <Alert severity="info" className={styles.infoAlert}>
            No instruments found. Please add instruments using the Instruments tab.
          </Alert>
        )}
        <Box className={styles.tabsContainer}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            className={styles.tabs}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Instruments" className={styles.tab} classes={{ selected: styles.tabSelected }} />
            <Tab label="Sterilization Records" className={styles.tab} classes={{ selected: styles.tabSelected }} />
            <Tab label="Requisitions" className={styles.tab} classes={{ selected: styles.tabSelected }} />
            <Tab label="Audit Logs" className={styles.tab} classes={{ selected: styles.tabSelected }} />
          </Tabs>
          <Box className={`${styles.tabContent} ${styles.fadeIn}`}>
            {tabValue === 0 && (
              <Box className={styles.sectionContainer}>
                <CssdInstrumentList />
              </Box>
            )}
            {tabValue === 1 && (
              <Box className={styles.sectionContainer}>
                <CssdRecordList />
              </Box>
            )}
            {tabValue === 2 && (
              <Box className={styles.sectionContainer}>
                <CssdRequisitionList />
              </Box>
            )}
            {tabValue === 3 && (
              <Box className={styles.sectionContainer}>
                <CssdLogList />
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}