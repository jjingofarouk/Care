'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, Typography } from '@mui/material';
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
          'var(--hospital-warning)',
          'var(--hospital-success)',
          'var(--hospital-error)',
          'var(--hospital-info)',
        ],
        borderColor: [
          'var(--hospital-warning)',
          'var(--hospital-success)',
          'var(--hospital-error)',
          'var(--hospital-info)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Appointments by Status',
        font: { size: 16, weight: 'bold' },
        color: 'var(--hospital-gray-900)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Appointments',
          color: 'var(--hospital-gray-900)',
        },
        grid: { color: 'var(--hospital-gray-200)' },
      },
      x: {
        title: {
          display: true,
          text: 'Status',
          color: 'var(--hospital-gray-900)',
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-2 max-w-full mx-auto">
      <Card className="card">
        <CardHeader
          title={<Typography className="card-title">Pending</Typography>}
          subheader={<Typography className="card-subtitle">{stats.pending}</Typography>}
          avatar={<Clock className="h-5 w-5 text-[var(--hospital-warning)]" />}
          className="card-header"
        />
      </Card>

      <Card className="card">
        <CardHeader
          title={<Typography className="card-title">Confirmed</Typography>}
          subheader={<Typography className="card-subtitle">{stats.confirmed}</Typography>}
          avatar={<CheckCircle className="h-5 w-5 text-[var(--hospital-success)]" />}
          className="card-header"
        />
      </Card>

      <Card className="card">
        <CardHeader
          title={<Typography className="card-title">Cancelled</Typography>}
          subheader={<Typography className="card-subtitle">{stats.cancelled}</Typography>}
          avatar={<XCircle className="h-5 w-5 text-[var(--hospital-error)]" />}
          className="card-header"
        />
      </Card>

      <Card className="card">
        <CardHeader
          title={<Typography className="card-title">Completed</Typography>}
          subheader={<Typography className="card-subtitle">{stats.completed}</Typography>}
          avatar={<Calendar className="h-5 w-5 text-[var(--hospital-info)]" />}
          className="card-header"
        />
      </Card>

      <Card className="card col-span-full p-4">
        <Bar data={chartData} options={chartOptions} />
      </Card>
    </div>
  );
}