'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { getAllAppointments } from '@/services/appointmentService';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

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
      const appointments = await getAllAppointments({});
      const stats = appointments.reduce(
        (acc, appt) => {
          acc[appt.appointmentStatus.toLowerCase()]++;
          return acc;
        },
        { pending: 0, confirmed: 0, cancelled: 0, completed: 0 }
      );
      setStats(stats);
    };
    fetchStats();
  }, []);

  const chartData = {
    type: 'bar',
    data: {
      labels: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      datasets: [{
        label: 'Appointment Status',
        data: [stats.pending, stats.confirmed, stats.cancelled, stats.completed],
        backgroundColor: [
          'var(--hospital-warning)',
          'var(--hospital-success)',
          'var(--hospital-error)',
          'var(--hospital-info)'
        ],
        borderColor: [
          'var(--hospital-warning)',
          'var(--hospital-success)',
          'var(--hospital-error)',
          'var(--hospital-info)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Appointments'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Status'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="card">
        <CardHeader
          title={<Typography className="card-title">Pending</Typography>}
          subheader={<Typography className="card-subtitle">{stats.pending}</Typography>}
          avatar={<Clock size={24} className="text-[var(--hospital-warning)]" />}
        />
      </Card>
      <Card className="card">
        <CardHeader
          title={<Typography className="card-title">Confirmed</Typography>}
          subheader={<Typography className="card-subtitle">{stats.confirmed}</Typography>}
          avatar={<CheckCircle size={24} className="text-[var(--hospital-success)]" />}
        />
      </Card>
      <Card className="card">
        <CardHeader
          title={<Typography className="card-title">Cancelled</Typography>}
          subheader={<Typography className="card-subtitle">{stats.cancelled}</Typography>}
          avatar={<XCircle size={24} className="text-[var(--hospital-error)]" />}
        />
      </Card>
      <Card className="card">
        <CardHeader
          title={<Typography className="card-title">Completed</Typography>}
          subheader={<Typography className="card-subtitle">{stats.completed}</Typography>}
          avatar={<Calendar size={24} className="text-[var(--hospital-info)]" />}
        />
      </Card>
      <Card className="card col-span-full">
        <CardContent>
          <Bar data={chartData.data} options={chartData.options} />
        </CardContent>
      </Card>
    </div>
  );
}