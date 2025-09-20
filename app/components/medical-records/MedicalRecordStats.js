'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getMedicalRecordStats } from '@/services/medicalRecordsService';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

  const chartData = {
    labels: [
      'Records',
      'Allergies',
      'Diagnoses',
      'Chief Complaints',
      'Medications',
      'Immunizations',
    ],
    datasets: [
      {
        label: 'Medical Record Statistics',
        data: [
          stats.totalRecords,
          stats.totalAllergies,
          stats.totalDiagnoses,
          stats.totalChiefComplaints,
          stats.totalMedications,
          stats.totalImmunizations,
        ],
        backgroundColor: [
          'var(--hospital-accent)',
          'var(--hospital-stable)',
          'var(--hospital-critical)',
          'var(--hospital-caution)',
          'var(--role-doctor)',
          'var(--role-staff)',
        ],
        borderColor: [
          'var(--hospital-accent-dark)',
          'var(--hospital-stable)',
          'var(--hospital-critical)',
          'var(--hospital-caution)',
          'var(--role-doctor)',
          'var(--role-staff)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Medical Record Statistics Overview',
        color: 'var(--hospital-gray-900)',
        font: { size: 16, weight: '600' },
      },
      tooltip: {
        backgroundColor: 'var(--hospital-gray-900)',
        titleColor: 'var(--hospital-white)',
        bodyColor: 'var(--hospital-white)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
          color: 'var(--hospital-gray-900)',
        },
        grid: { color: 'var(--hospital-gray-200)' },
        ticks: { color: 'var(--hospital-gray-900)' },
      },
      x: {
        title: {
          display: true,
          text: 'Categories',
          color: 'var(--hospital-gray-900)',
        },
        grid: { display: false },
        ticks: { color: 'var(--hospital-gray-900)' },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="card m-0 p-4">
        <div className="flex items-center mb-2">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="var(--hospital-accent)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m-2 4h2m-6 4h4m-9 6V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h1 className="card-title">Medical Record Statistics</h1>
        </div>

        {error && (
          <div className="alert alert-error mb-2">
            {error}
          </div>
        )}

        <Grid container spacing={1}>
          {[
            { label: 'Total Records', value: stats.totalRecords },
            { label: 'Total Allergies', value: stats.totalAllergies },
            { label: 'Total Diagnoses', value: stats.totalDiagnoses },
            { label: 'Avg Records/Patient', value: stats.averageRecordsPerPatient },
            { label: 'Total Chief Complaints', value: stats.totalChiefComplaints },
            { label: 'Total Medications', value: stats.totalMedications },
            { label: 'Total Immunizations', value: stats.totalImmunizations },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <div className="card p-2 bg-[var(--hospital-gray-100)]">
                <span className="text-sm text-[var(--hospital-gray-500)]">{item.label}</span>
                <Typography variant="h6" className="font-semibold text-[var(--hospital-gray-900)]">
                  {item.value}
                </Typography>
              </div>
            </Grid>
          ))}
        </Grid>

        <div className="mt-4 h-96 w-full">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordStats;