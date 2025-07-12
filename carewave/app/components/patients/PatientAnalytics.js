"use client";

import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

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
      patients.forEach((patient) => {
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

  const genderChartData = {
    labels: Object.keys(analytics.gender),
    datasets: [
      {
        label: 'Gender Distribution',
        data: Object.values(analytics.gender),
        backgroundColor: 'var(--hospital-accent)',
        borderColor: 'var(--hospital-accent-dark)',
        borderWidth: 1,
      },
    ],
  };

  const ageChartData = {
    labels: Object.keys(analytics.age),
    datasets: [
      {
        label: 'Age Distribution',
        data: Object.values(analytics.age),
        backgroundColor: 'var(--hospital-stable)',
        borderColor: 'var(--hospital-accent-dark)',
        borderWidth: 1,
      },
    ],
  };

  const insuranceChartData = {
    labels: Object.keys(analytics.insurance),
    datasets: [
      {
        label: 'Insurance Distribution',
        data: Object.values(analytics.insurance),
        backgroundColor: [
          'var(--hospital-accent)',
          'var(--hospital-error)',
          'var(--role-doctor)',
          'var(--hospital-info)',
          'var(--hospital-gray-400)',
        ],
        borderColor: [
          'var(--hospital-accent-dark)',
          'var(--hospital-critical)',
          'var(--role-doctor)',
          'var(--hospital-info)',
          'var(--hospital-gray-500)',
        ],
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
          font: { size: 12 },
          color: 'var(--text-primary)',
        },
      },
      title: {
        display: true,
        font: { size: 16 },
        color: 'var(--hospital-gray-900)',
        padding: { bottom: 12 },
      },
    },
  };

  const genderChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Patient Gender Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Patients',
          color: 'var(--hospital-gray-700)',
          font: { size: 12 },
        },
        grid: { color: 'var(--hospital-gray-200)' },
        ticks: { color: 'var(--text-primary)' },
      },
      x: {
        title: {
          display: true,
          text: 'Gender',
          color: 'var(--hospital-gray-700)',
          font: { size: 12 },
        },
        grid: { display: false },
        ticks: { color: 'var(--text-primary)' },
      },
    },
  };

  const ageChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Patient Age Distribution',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Patients',
          color: 'var(--hospital-gray-700)',
          font: { size: 12 },
        },
        grid: { color: 'var(--hospital-gray-200)' },
        ticks: { color: 'var(--text-primary)' },
      },
      x: {
        title: {
          display: true,
          text: 'Age Group',
          color: 'var(--hospital-gray-700)',
          font: { size: 12 },
        },
        grid: { display: false },
        ticks: { color: 'var(--text-primary)' },
      },
    },
  };

  const insuranceChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Patient Insurance Distribution',
      },
    },
  };

  return (
    <div className="card p-4 max-w-[100vw] overflow-x-auto min-h-screen">
      <h1 className="card-title mb-4">Patient Analytics</h1>
      {loading ? (
        <div className="flex justify-center p-4">
          <div className="loading-spinner" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-[var(--hospital-white)] rounded-xl p-3 shadow-[var(--shadow-sm)] h-[400px]">
            <Bar data={genderChartData} options={genderChartOptions} />
          </div>
          <div className="bg-[var(--hospital-white)] rounded-xl p-3 shadow-[var(--shadow-sm)] h-[400px]">
            <Bar data={ageChartData} options={ageChartOptions} />
          </div>
          <div className="bg-[var(--hospital-white)] rounded-xl p-3 shadow-[var(--shadow-sm)] h-[400px] md:col-span-1">
            <Pie data={insuranceChartData} options={insuranceChartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}