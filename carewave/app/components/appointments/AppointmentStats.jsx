'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, Typography, Box } from '@mui/material';
import { Clock, CheckCircle, XCircle, Calendar, TrendingUp } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
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

const StatCard = ({ title, value, icon: Icon, color, delay = 0, trend = null }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          delay: delay,
          ease: [0.25, 0.46, 0.45, 0.94] 
        }}
        whileHover={{ 
          y: -8, 
          scale: 1.02,
          transition: { duration: 0.3 }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative group"
      >
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 rounded-3xl blur-xl opacity-20"
          style={{ backgroundColor: color }}
          animate={{
            scale: isHovered ? 1.1 : 1,
            opacity: isHovered ? 0.3 : 0.1,
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Main card */}
        <div className="relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden">
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0 opacity-5 bg-gradient-to-br from-transparent via-transparent to-current"
            style={{ color }}
          />
          
          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <motion.div
                className="p-3 rounded-2xl bg-white/50 backdrop-blur-sm"
                style={{ backgroundColor: `${color}15` }}
                whileHover={{ 
                  rotate: [0, -5, 5, 0],
                  scale: 1.1
                }}
                transition={{ duration: 0.5 }}
              >
                <Icon className="h-6 w-6" style={{ color }} />
              </motion.div>
              
              {trend && (
                <motion.div
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + 0.3 }}
                >
                  <TrendingUp className="h-3 w-3" />
                  {trend}
                </motion.div>
              )}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.2 }}
            >
              <Typography className="text-sm font-medium text-gray-600 mb-1">
                {title}
              </Typography>
              <Typography 
                className="text-3xl font-bold"
                style={{ color }}
              >
                <NumberCounter endValue={value} duration={1.5} />
              </Typography>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-sm" />
          <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-sm" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function AppointmentStats() {
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    thisWeekAppointments: 0,
    topDepartments: [],
    topVisitTypes: [],
    avgAppointmentsPerDay: 0,
    busyDays: [],
    doctorUtilization: [],
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

  const cardData = [
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "var(--hospital-warning)",
      trend: "+12%"
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircle,
      color: "var(--hospital-success)",
      trend: "+8%"
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "var(--hospital-error)",
      trend: "-5%"
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: Calendar,
      color: "var(--hospital-info)",
      trend: "+15%"
    }
  ];

  return (
    <div className="max-w-full mx-auto mb-6 p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Typography variant="h4" className="text-2xl font-bold text-gray-900 mb-2">
          Appointment Dashboard
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Real-time overview of your appointment statistics
        </Typography>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, index) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            delay={index * 0.1}
            trend={card.trend}
          />
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 rounded-3xl" />
          
          {/* Chart content */}
          <div className="relative z-10">
            <Box className="h-[400px]">
              <Bar data={chartData} options={chartOptions} />
            </Box>
          </div>
        </div>
      </motion.div>
    </div>
  );
}