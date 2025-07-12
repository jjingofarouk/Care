"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

export default function PatientAnalytics() {
  const [analytics, setAnalytics] = useState({ gender: {}, age: {}, insurance: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/patients?include=insuranceInfo');
      if (!response.ok) throw new Error('Failed to fetch patients');
      const patients = await response.json();
      
      const genderCounts = patients.reduce((acc, patient) => {
        const gender = patient.gender || 'Unknown';
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
      }, {});

      const ageGroups = {
        '0-18': 0,
        '19-30': 0,
        '31-50': 0,
        '51+': 0,
      };
      patients.forEach(patient => {
        const age = Math.floor((Date.now() - new Date(patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000));
        if (age <= 18) ageGroups['0-18']++;
        else if (age <= 30) ageGroups['19-30']++;
        else if (age <= 50) ageGroups['31-50']++;
        else ageGroups['51+']++;
      });

      const insuranceCounts = patients.reduce((acc, patient) => {
        const provider = patient.insuranceInfo?.provider || 'No Insurance';
        acc[provider] = (acc[provider] || 0) + 1;
        return acc;
      }, {});

      setAnalytics({ gender: genderCounts, age: ageGroups, insurance: insuranceCounts });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const genderChart = {
    type: 'bar',
    data: {
      labels: Object.keys(analytics.gender),
      datasets: [{
        label: 'Gender Distribution',
        data: Object.values(analytics.gender),
        backgroundColor: '#2196F3',
        borderColor: '#1976D2',
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          position: 'top',
          labels: { font: { size: 12 } }
        },
        title: { 
          display: true, 
          text: 'Patient Gender Distribution',
          font: { size: 16 },
          padding: { bottom: 20 }
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Number of Patients' }
        }
      }
    }
  };

  const ageChart = {
    type: 'bar',
    data: {
      labels: Object.keys(analytics.age),
      datasets: [{
        label: 'Age Distribution',
        data: Object.values(analytics.age),
        backgroundColor: '#4CAF50',
        borderColor: '#388E3C',
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          position: 'top',
          labels: { font: { size: 12 } }
        },
        title: { 
          display: true, 
          text: 'Patient Age Distribution',
          font: { size: 16 },
          padding: { bottom: 20 }
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Number of Patients' }
        }
      }
    }
  };

  const insuranceChart = {
    type: 'pie',
    data: {
      labels: Object.keys(analytics.insurance),
      datasets: [{
        label: 'Insurance Distribution',
        data: Object.values(analytics.insurance),
        backgroundColor: ['#FF9800', '#F44336', '#9C27B0', '#3F51B5'],
        borderColor: ['#FB8C00', '#D32F2F', '#7B1FA2', '#303F9F'],
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          position: 'top',
          labels: { font: { size: 12 } }
        },
        title: { 
          display: true, 
          text: 'Patient Insurance Distribution',
          font: { size: 16 },
          padding: { bottom: 20 }
        },
      }
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: '100%', overflowX: 'auto' }}>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
        Patient Analytics
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Paper sx={{ p: 3, height: 400, borderRadius: 2, boxShadow: 1 }}>
            <canvas id="genderChart" />
            <script type="chartjs">{JSON.stringify(genderChart)}</script>
          </Paper>
          <Paper sx={{ p: 3, height: 400, borderRadius: 2, boxShadow: 1 }}>
            <canvas id="ageChart" />
            <script type="chartjs">{JSON.stringify(ageChart)}</script>
          </Paper>
          <Paper sx={{ p: 3, height: 400, borderRadius: 2, boxShadow: 1, gridColumn: { xs: '1 / -1', md: '1 / 2' } }}>
            <canvas id="insuranceChart" />
            <script type="chartjs">{JSON.stringify(insuranceChart)}</script>
          </Paper>
        </Box>
      )}
    </Box>
  );
}