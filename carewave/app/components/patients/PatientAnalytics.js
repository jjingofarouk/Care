// app/components/patients/PatientAnalytics.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PatientAnalytics() {
  const [analytics, setAnalytics] = useState({ gender: {}, age: {} });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/patients');
      const patients = await response.json();
      
      const genderCounts = patients.reduce((acc, patient) => {
        acc[patient.gender || 'Unknown'] = (acc[patient.gender || 'Unknown'] || 0) + 1;
        return acc;
      }, {});

      const ageGroups = {
        '0-18': 0,
        '19-30': 0,
        '31-50': 0,
        '51+': 0,
      };
      patients.forEach(patient => {
        const age = Math.floor((new Date() - new Date(patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000));
        if (age <= 18) ageGroups['0-18']++;
        else if (age <= 30) ageGroups['19-30']++;
        else if (age <= 50) ageGroups['31-50']++;
        else ageGroups['51+']++;
      });

      setAnalytics({ gender: genderCounts, age: ageGroups });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const genderChart = {
    type: 'bar',
    data: {
      labels: Object.keys(analytics.gender),
      datasets: [{
        label: 'Gender Distribution',
        data: Object.values(analytics.gender),
        backgroundColor: 'var(--hospital-accent)',
        borderColor: 'var(--hospital-accent-dark)',
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Patient Gender Distribution' },
      },
    },
  };

  const ageChart = {
    type: 'bar',
    data: {
      labels: Object.keys(analytics.age),
      datasets: [{
        label: 'Age Distribution',
        data: Object.values(analytics.age),
        backgroundColor: 'var(--hospital-info)',
        borderColor: 'var(--hospital-info-dark)',
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Patient Age Distribution' },
      },
    },
  };

  return (
    <Box className="p-6">
      <Typography variant="h5" className="card-title mb-6">Patient Analytics</Typography>
      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Paper className="card p-6">
          <Bar data={genderChart.data} options={genderChart.options} />
        </Paper>
        <Paper className="card p-6">
          <Bar data={ageChart.data} options={ageChart.options} />
        </Paper>
      </Box>
    </Box>
  );
}