"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Skeleton, Alert, Card, CardContent, Grid, styled } from '@mui/material';
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
import axios from 'axios';
import api from '../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ModernBox = styled(Box)(() => ({
  padding: '2rem',
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  minHeight: '100vh',
  color: '#ffffff',
  '@media (max-width: 600px)': {
    padding: '1rem',
  },
}));

const ModernTypography = styled(Typography)(() => ({
  fontWeight: 700,
  background: 'linear-gradient(45deg, #00b0ff, #80d8ff)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 2px 4px rgba(0, 123, 255, 0.3)',
  marginBottom: '1.5rem',
  textAlign: 'center',
  '@media (max-width: 600px)': {
    fontSize: '1.8rem',
  },
}));

const ModernCard = styled(Card)(() => ({
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 32px rgba(0, 123, 255, 0.3)',
  },
  '@media (max-width: 600px)': {
    marginBottom: '1rem',
  },
}));

const ModernCardContent = styled(CardContent)(() => ({
  color: '#ffffff',
  textAlign: 'center',
  '& .MuiTypography-h6': {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1rem',
    marginBottom: '0.5rem',
  },
  '& .MuiTypography-h4': {
    background: 'linear-gradient(45deg, #00b0ff, #80d8ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 700,
  },
}));

const ChartContainer = styled(Box)(() => ({
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '16px',
  padding: '1.5rem',
  marginBottom: '2rem',
  maxWidth: '800px',
  margin: '0 auto',
  '@media (max-width: 600px)': {
    padding: '1rem',
  },
}));

export default function Dashboard() {
  const [data, setData] = useState({
    appointments: [],
    doctors: [],
    queues: [],
    availability: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const [appointmentsRes, doctorsRes, queuesRes, availabilityRes] = await Promise.all([
          axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${api.BASE_URL}${api.API_ROUTES.DOCTOR}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${api.BASE_URL}${api.API_ROUTES.QUEUE}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${api.BASE_URL}${api.API_ROUTES.AVAILABILITY}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setData({
          appointments: appointmentsRes.data,
          doctors: doctorsRes.data,
          queues: queuesRes.data,
          availability: availabilityRes.data,
        });
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const todayAppointments = data.appointments.filter((appt) => {
    const date = new Date(appt.date);
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  });

  const stats = {
    totalAppointments: data.appointments.length,
    todayAppointments: todayAppointments.length,
    scheduled: todayAppointments.filter((appt) => appt.status === 'SCHEDULED').length,
    checkedIn: todayAppointments.filter((appt) => appt.status === 'CHECKED_IN').length,
    completed: todayAppointments.filter((appt) => appt.status === 'COMPLETED').length,
    cancelled: todayAppointments.filter((appt) => appt.status === 'CANCELLED').length,
    availableDoctors: data.availability.filter((avail) => avail.status === 'AVAILABLE').length,
    activeQueues: data.queues.filter((queue) => queue.status === 'WAITING' || queue.status === 'IN_PROGRESS').length,
  };

  const appointmentChart = {
    type: 'bar',
    data: {
      labels: ['Scheduled', 'Checked In', 'Completed', 'Cancelled'],
      datasets: [
        {
          label: 'Today\'s Appointments',
          data: [stats.scheduled, stats.checkedIn, stats.completed, stats.cancelled],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Today\'s Appointment Status',
          color: '#ffffff',
          font: { size: 16 },
        },
        legend: {
          labels: {
            color: '#ffffff',
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#ffffff' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
        },
        x: {
          ticks: { color: '#ffffff' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
        },
      },
    }
  };

  const doctorChart = {
    type: 'doughnut',
    data: {
      labels: ['Available Doctors', 'Active Queues'],
      datasets: [
        {
          data: [stats.availableDoctors, stats.activeQueues],
          backgroundColor: ['rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
          borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Doctor & Queue Overview',
          color: '#ffffff',
          font: { size: 16 },
        },
        legend: {
          labels: {
            color: '#ffffff',
          },
          position: 'bottom',
        },
      },
    }
  };

  return (
    <ModernBox>
      <ModernTypography variant="h4">Healthcare Dashboard</ModernTypography>
      {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(255, 75, 75, 0.1)', color: '#ff6b6b' }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
          <Skeleton variant="text" width="60%" sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <ModernCard>
                <ModernCardContent>
                  <Typography variant="h6">Total Appointments</Typography>
                  <Typography variant="h4">{stats.totalAppointments}</Typography>
                </ModernCardContent>
              </ModernCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ModernCard>
                <ModernCardContent>
                  <Typography variant="h6">Today&apos;s Appointments</Typography>
                  <Typography variant="h4">{stats.todayAppointments}</Typography>
                </ModernCardContent>
              </ModernCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ModernCard>
                <ModernCardContent>
                  <Typography variant="h6">Available Doctors</Typography>
                  <Typography variant="h4">{stats.availableDoctors}</Typography>
                </ModernCardContent>
              </ModernCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ModernCard>
                <ModernCardContent>
                  <Typography variant="h6">Active Queues</Typography>
                  <Typography variant="h4">{stats.activeQueues}</Typography>
                </ModernCardContent>
              </ModernCard>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ChartContainer>
                {appointmentChart}
              </ChartContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartContainer>
                {doctorChart}
              </ChartContainer>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
              Today&apos;s Appointments
            </Typography>
            <Grid container spacing={2}>
              {todayAppointments.map((appt) => (
                <Grid item xs={12} sm={6} md={4} key={appt.id}>
                  <ModernCard>
                    <ModernCardContent>
                      <Typography><strong>Patient:</strong> {appt.patient?.user?.name || appt.patient?.patientId || 'N/A'}</Typography>
                      <Typography><strong>Doctor:</strong> {appt.doctor?.user?.name || appt.doctor?.doctorId || 'N/A'}</Typography>
                      <Typography><strong>Time:</strong> {appt.date ? new Date(appt.date).toLocaleString() : 'N/A'}</Typography>
                      <Typography><strong>Status:</strong> {appt.status || 'N/A'}</Typography>
                      <Typography><strong>Reason:</strong> {appt.reason || 'N/A'}</Typography>
                    </ModernCardContent>
                  </ModernCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      )}
    </ModernBox>
  );
}