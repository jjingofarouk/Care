'use client';
import React from 'react';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, Typography } from '@mui/material';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';

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
            acc[appt.appointmentStatus.toLowerCase()]++;
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
      <Card className="card">
        <CardHeader
          title={<Typography className="card-title">Pending</Typography>}
          subheader={<Typography className="card-subtitle">{stats.pending}</Typography>}
          avatar={<Clock size={20} className="text-[var(--hospital-warning)]" />}
        />
      </Card>
      <Card className="card">
        <CardHeader
          title={<Typography className="card-title">Confirmed</Typography>}
          subheader={<Typography className="card-subtitle">{stats.confirmed}</Typography>}
          avatar={<CheckCircle size={20} className="text-[var(--hospital-success)]" />}
        />
      </Card>
      <Card className="card">
        <CardHeader
          title={<Typography className="card-title">Cancelled</Typography>}
          subheader={<Typography className="card-subtitle">{stats.cancelled}</Typography>}
          avatar={<XCircle size={20} className="text-[var(--hospital-error)]" />}
        />
      </Card>
      <Card className="card">
        <CardHeader
          title={<Typography className="card-title">Completed</Typography>}
          subheader={<Typography className="card-subtitle">{stats.completed}</Typography>}
          avatar={<Calendar size={20} className="text-[var(--hospital-info)]" />}
        />
      </Card>
      <Card className="card col-span-full">
        ```chartjs
        {
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
        }