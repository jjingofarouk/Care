'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, Typography, Box } from '@mui/material';
import { Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { motion } from 'framer-motion';
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

const NumberCounter = ({ endValue, duration = 2 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = endValue / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= endValue) {
        setCount(endValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [endValue, duration]);

  return <span>{count}</span>;
};

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
          'var(--hospital-warning)', // Amber
          'var(--hospital-success)', // Green
          'var(--hospital-error)',   // Red
          'var(--hospital-info)',    // Blue
        ],
        borderColor: [
          'var(--hospital-warning)',
          'var(--hospital-success)',
          'var(--hospital-error)',
          'var(--hospital-info)',
        ],
        borderWidth: 0,
        borderRadius: 12,
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
        text: 'Appointments Overview',
        font: { size: 20, weight: '600', family: 'Inter, sans-serif' },
        color: 'var(--hospital-gray-900)',
        padding: { top: 16, bottom: 24 },
      },
      tooltip: {
        backgroundColor: 'var(--hospital-gray-900)',
        titleFont: { size: 14, weight: '600' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
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
        grid: { display: false },
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
        grid: { display: false },
        ticks: {
          color: 'var(--hospital-gray-700)',
          font: { size: 12 },
        },
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5, 
        ease: 'easeOut',
        staggerChildren: 0.1 
      } 
    },
    hover: { 
      scale: 1.03, 
      boxShadow: 'var(--shadow-lg)', 
      transition: { duration: 0.3 } 
    },
  };

  const statVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <div className="max-w-full mx-auto mb-6">
      <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Card className="card bg-[var(--hospital-white)] border-none rounded-2xl overflow-hidden">
            <CardHeader
              title={
                <motion.div variants={statVariants}>
                  <Typography className="text-base font-semibold text-[var(--hospital-gray-900)]">Pending</Typography>
                </motion.div>
              }
              subheader={
                <motion.div variants={statVariants}>
                  <Typography className="text-4xl font-extrabold text-[var(--hospital-warning)]">
                    <NumberCounter endValue={stats.pending} duration={1.5} />
                  </Typography>
                </motion.div>
              }
              avatar={
                <motion.div variants={statVariants}>
                  <Clock className="h-10 w-10 text-[var(--hospital-warning)]" />
                </motion.div>
              }
              className="p-6 bg-[var(--hospital-gray-50)]"
            />
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Card className="card bg-[var(--hospital-white)] border-none rounded-2xl overflow-hidden">
            <CardHeader
              title={
                <motion.div variants={statVariants}>
                  <Typography className="text-base font-semibold text-[var(--hospital-gray-900)]">Confirmed</Typography>
                </motion.div>
              }
              subheader={
                <motion.div variants={statVariants}>
                  <Typography className="text-4xl font-extrabold text-[var(--hospital-success)]">
                    <NumberCounter endValue={stats.confirmed} duration={1.5} />
                  </Typography>
                </motion.div>
              }
              avatar={
                <motion.div variants={statVariants}>
                  <CheckCircle className="h-10 w-10 text-[var(--hospital-success)]" />
                </motion.div>
              }
              className="p-6 bg-[var(--hospital-gray-50)]"
            />
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Card className="card bg-[var(--hospital-white)] border-none rounded-2xl overflow-hidden">
            <CardHeader
              title={
                <motion.div variants={statVariants}>
                  <Typography className="text-base font-semibold text-[var(--hospital-gray-900)]">Cancelled</Typography>
                </motion.div>
              }
              subheader={
                <motion.div variants={statVariants}>
                  <Typography className="text-4xl font-extrabold text-[var(--hospital-error)]">
                    <NumberCounter endValue={stats.cancelled} duration={1.5} />
                  </Typography>
                </motion.div>
              }
              avatar={
                <motion.div variants={statVariants}>
                  <XCircle className="h-10 w-10 text-[var(--hospital-error)]" />
                </motion.div>
              }
              className="p-6 bg-[var(--hospital-gray-50)]"
            />
          </Card>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          <Card className="card bg-[var(--hospital-white)] border-none rounded-2xl overflow-hidden">
            <CardHeader
              title={
                <motion.div variants={statVariants}>
                  <Typography className="text-base font-semibold text-[var(--hospital-gray-900)]">Completed</Typography>
                </motion.div>
              }
              subheader={
                <motion.div variants={statVariants}>
                  <Typography className="text-4xl font-extrabold text-[var(--hospital-info)]">
                    <NumberCounter endValue={stats.completed} duration={1.5} />
                  </Typography>
                </motion.div>
              }
              avatar={
                <motion.div variants={statVariants}>
                  <Calendar className="h-10 w-10 text-[var(--hospital-info)]" />
                </motion.div>
              }
              className="p-6 bg-[var(--hospital-gray-50)]"
            />
          </Card>
        </motion.div>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      >
        <Card className="card col-span-full p-6 bg-[var(--hospital-white)] rounded-2xl shadow-md">
          <Box className="h-[400px]">
            <Bar data={chartData} options={chartOptions} />
          </Box>
        </Card>
      </motion.div>
    </div>
  );
}