'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, Typography, Box } from '@mui/material';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AppointmentStats() {
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/appointments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const appointments = await response.json();
        const stats = appointments.reduce(
          (acc, appt) => {
            const key = appt.appointmentStatus?.toLowerCase();
            if (acc[key] !== undefined) acc[key]++;
            return acc;
          },
          { pending: 0, confirmed: 0, cancelled: 0, completed: 0 }
        );
        setStats(stats);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const chartData = {
    labels: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    datasets: [
      {
        label: 'Appointment Status',
        data: [stats.pending, stats.confirmed, stats.cancelled, stats.completed],
        backgroundColor: [
          'var(--hospital-warning)', // Amber for Pending
          'var(--hospital-success)', // Green for Confirmed
          'var(--hospital-error)',   // Red for Cancelled
          'var(--hospital-info)',    // Blue for Completed
        ],
        borderColor: [
          'var(--hospital-warning)',
          'var(--hospital-success)',
          'var(--hospital-error)',
          'var(--hospital-info)',
        ],
        borderWidth: 0,
        borderRadius: 8, // Rounded corners for bars
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Appointments by Status',
        font: { size: 18, weight: '600' },
        color: 'var(--hospital-gray-900)',
        padding: { top: 8, bottom: 16 },
      },
      tooltip: {
        backgroundColor: 'var(--hospital-gray-900)',
        titleFont: { size: 14, weight: '600' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 6,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Appointments',
          color: 'var(--hospital-gray-900)',
          font: { size: 14, weight: '500' },
        },
        grid: { display: false }, // Remove grid lines
        ticks: {
          color: 'var(--hospital-gray-700)',
          font: { size: 12 },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Status',
          color: 'var(--hospital-gray-900)',
          font: { size: 14, weight: '500' },
        },
        grid: { display: false }, // Remove grid lines
        ticks: {
          color: 'var(--hospital-gray-700)',
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-2 max-w-full mx-auto">
      <Card className="card transition-all duration-300 hover:shadow-md">
        <CardHeader
          title={<Typography className="card-title text-base font-semibold">Pending</Typography>}
          subheader={<Typography className="card-subtitle text-2xl font-bold text-[var(--hospital-warning)]">{stats.pending}</Typography>}
          avatar={<Clock className="h-6 w-6 text-[var(--hospital-warning)]" />}
          className="card-header p-4"
        />
      </Card>

      <Card className="card transition-all duration-300 hover:shadow-md">
        <CardHeader
          title={<Typography className="card-title text-base font-semibold">Confirmed</Typography>}
          subheader={<Typography className="card-subtitle text-2xl font-bold text-[var(--hospital-success)]">{stats.confirmed}</Typography>}
          avatar={<CheckCircle className="h-6 w-6 text-[var(--hospital-success)]" />}
          className="card-header p-4"
        />
      </Card>

      <Card className="card transition-all duration-300 hover:shadow-md">
        <CardHeader
          title={<Typography className="card-title text-base font-semibold">Cancelled</Typography>}
          subheader={<Typography className="card-subtitle text-2xl font-bold text-[var(--hospital-error)]">{stats.cancelled}</Typography>}
          avatar={<XCircle className="h-6 w-6 text-[var(--hospital-error)]" />}
          className="card-header p-4"
        />
      </Card>

      <Card className="card transition-all duration-300 hover:shadow-md">
        <CardHeader
          title={<Typography className="card-title text-base font-semibold">Completed</Typography>}
          subheader={<Typography className="card-subtitle text-2xl font-bold text-[var(--hospital-info)]">{stats.completed}</Typography>}
          avatar={<Calendar className="h-6 w-6 text-[var(--hospital-info)]" />}
          className="card-header p-4"
        />
      </Card>

      <Card className="card col-span-full p-4">
        <Box className="h-[400px]">
          <Bar data={chartData} options={chartOptions} />
        </Box>
      </Card>
    </div>
  );
}