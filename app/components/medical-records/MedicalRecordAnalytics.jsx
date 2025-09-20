'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

export default function MedicalRecordAnalytics() {
  const [analytics, setAnalytics] = useState({
    totalRecords: 0,
    recentRecords: 0,
    commonDiagnoses: [],
    activeAllergies: 0,
  });

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/medical-records?include=diagnoses,allergies');
        const records = await response.json();
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const diagnosisCounts = {};
        let activeAllergies = 0;

        records.forEach(record => {
          record.diagnoses.forEach(diagnosis => {
            diagnosisCounts[diagnosis.description] = (diagnosisCounts[diagnosis.description] || 0) + 1;
          });
          activeAllergies += record.allergies.length;
        });

        const commonDiagnoses = Object.entries(diagnosisCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setAnalytics({
          totalRecords: records.length,
          recentRecords: records.filter(r => new Date(r.recordDate) >= thirtyDaysAgo).length,
          commonDiagnoses,
          activeAllergies,
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    }
    fetchAnalytics();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Medical Records Analytics</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Records</Typography>
            <Typography variant="h4">{analytics.totalRecords}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Recent Records (30 days)</Typography>
            <Typography variant="h4">{analytics.recentRecords}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Active Allergies</Typography>
            <Typography variant="h4">{analytics.activeAllergies}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Top 5 Common Diagnoses</Typography>
            {analytics.commonDiagnoses.map((diagnosis, index) => (
              <Typography key={index}>
                {diagnosis.name}: {diagnosis.count} cases
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}