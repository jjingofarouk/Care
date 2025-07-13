'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Alert } from '@mui/material';
import { BarChart2 } from 'lucide-react';
import { getMedicalRecordStats } from '../services/medicalRecordsService';

const MedicalRecordStats = () => {
  const [stats, setStats] = useState({
    totalRecords: 0,
    totalAllergies: 0,
    totalDiagnoses: 0,
    averageRecordsPerPatient: 0,
    totalChiefComplaints: 0,
    totalMedications: 0,
    totalImmunizations: 0,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getMedicalRecordStats();
        setStats(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(error.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
        <Typography>Loading statistics...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <BarChart2 size={24} style={{ marginRight: 8 }} />
        <Typography variant="h5">Medical Record Statistics</Typography>
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total Records
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {stats.totalRecords}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total Allergies
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {stats.totalAllergies}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total Diagnoses
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {stats.totalDiagnoses}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Avg Records/Patient
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {stats.averageRecordsPerPatient}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total Chief Complaints
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {stats.totalChiefComplaints}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total Medications
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {stats.totalMedications}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total Immunizations
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {stats.totalImmunizations}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, height: 400 }}>
        ```chartjs
        {
          "type": "bar",
          "data": {
            "labels": ["Records", "Allergies", "Diagnoses", "Chief Complaints", "Medications", "Immunizations"],
            "datasets": [{
              "label": "Medical Record Statistics",
              "data": [
                ${stats.totalRecords},
                ${stats.totalAllergies},
                ${stats.totalDiagnoses},
                ${stats.totalChiefComplaints},
                ${stats.totalMedications},
                ${stats.totalImmunizations}
              ],
              "backgroundColor": [
                "#42A5F5",
                "#66BB6A",
                "#EF5350",
                "#FFCA28",
                "#AB47BC",
                "#26A69A"
              ],
              "borderColor": [
                "#1976D2",
                "#388E3C",
                "#C62828",
                "#FBC02D",
                "#7B1FA2",
                "#00897B"
              ],
              "borderWidth": 1
            }]
          },
          "options": {
            "responsive": true,
            "maintainAspectRatio": false,
            "scales": {
              "y": {
                "beginAtZero": true,
                "title": {
                  "display": true,
                  "text": "Count"
                }
              },
              "x": {
                "title": {
                  "display": true,
                  "text": "Categories"
                }
              }
            },
            "plugins": {
              "legend": {
                "display": true,
                "position": "top"
              },
              "title": {
                "display": true,
                "text": "Medical Record Statistics Overview"
              }
            }
          }
        }
        ```
      </Box>
    </Box>
  );
};

export default MedicalRecordStats;