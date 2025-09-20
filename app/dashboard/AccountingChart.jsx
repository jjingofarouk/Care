"use client";
import React from 'react';
import { Box, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './AccountingChart.module.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AccountingChart({ data }) {
  const chartData = {
    labels: data?.labels || ['Revenue', 'Expenses', 'Pending', 'Other'],
    datasets: [
      {
        data: [
          data?.revenue || 0,
          data?.expenses || 0,
          data?.pending || 0,
          data?.other || 0,
        ],
        backgroundColor: ['#2196F3', '#F44336', '#FFC107', '#4CAF50'],
        borderColor: ['#1976D2', '#D32F2F', '#FFA000', '#388E3C'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#2d3748',
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `UGX ${context.parsed.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <Box className={styles.chart} sx={{ p: 2, background: '#fff', borderRadius: 2 }}>
      <Typography variant="h6" className={styles.title} sx={{ mb: 2, color: '#1976d2' }}>
        Financial Overview
      </Typography>
      <Box className={styles.chartContainer} sx={{ height: 300 }}>
        <Pie data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
}