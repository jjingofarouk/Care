'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { 
  Clock, 
  CheckCircle, 
  Calendar, 
  TrendingUp, 
  Activity,
  Calendar as CalendarIcon,
  UserCheck,
  BarChart3,
  Star
} from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import AppointmentFilter from './AppointmentFilter';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
);

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

const StatCard = ({ title, value, icon: Icon, color, delay = 0, trend = null, subtitle = null }) => {
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
        <motion.div
          className="absolute inset-0 rounded-3xl blur-xl opacity-20"
          style={{ backgroundColor: color }}
          animate={{
            scale: isHovered ? 1.1 : 1,
            opacity: isHovered ? 0.3 : 0.1,
          }}
          transition={{ duration: 0.3 }}
        />
        <div className="relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl overflow-hidden">
          <div 
            className="absolute inset-0 opacity-5 bg-gradient-to-br from-transparent via-transparent to-current"
            style={{ color }}
          />
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
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + 0.3 }}
                >
                  <TrendingUp className="h-3 w-3" />
                  {trend >= 0 ? '+' : ''}{trend}%
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
                className="text-3xl font-bold mb-1"
                style={{ color }}
              >
                <NumberCounter endValue={value} duration={1.5} />
              </Typography>
              {subtitle && (
                <Typography className="text-xs text-gray-500">
                  {subtitle}
                </Typography>
              )}
            </motion.div>
          </div>
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-transparent blur-sm" />
          <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-sm" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const ChartCard = ({ title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 rounded-3xl" />
    <div className="relative z-10">
      <Typography variant="h6" className="text-lg font-semibold text-gray-800 mb-6">
        {title}
      </Typography>
      {children}
    </div>
  </motion.div>
);

export default function AppointmentStats() {
  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    thisWeekAppointments: 0,
    thisMonthAppointments: 0,
    topDepartments: [],
    topVisitTypes: [],
    topDoctors: [],
    avgAppointmentsPerDay: 0,
    completionRate: 0,
    cancellationRate: 0,
    monthlyTrend: [],
    weeklyDistribution: [],
    timeSlotDistribution: [],
    monthTrend: 0,
    weekTrend: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    doctorId: '',
    patientId: '',
    dateFrom: '',
    dateTo: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        resource: 'stats',
        ...(filters.status && { status: filters.status }),
        ...(filters.doctorId && { doctorId: filters.doctorId }),
        ...(filters.patientId && { patientId: filters.patientId }),
        ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
        ...(filters.dateTo && { dateTo: filters.dateTo }),
      });
      const response = await fetch(`/api/appointments?${queryParams}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      if (!response.ok) throw new Error('Failed to fetch appointment stats');
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching appointment stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <Typography className="text-red-800">
          Error loading appointment statistics: {error}
        </Typography>
      </div>
    );
  }

  const statusChartData = {
    labels: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    datasets: [{
      label: 'Appointment Status',
      data: [stats.pending, stats.confirmed, stats.cancelled, stats.completed],
      backgroundColor: ['#FFA726', '#4CAF50', '#F44336', '#2196F3'],
      borderColor: ['#FF9800', '#4CAF50', '#F44336', '#2196F3'],
      borderWidth: 0,
      borderRadius: 12,
    }],
  };

  const doughnutData = {
    labels: ['Completed', 'Cancelled', 'Pending', 'Confirmed'],
    datasets: [{
      data: [stats.completed, stats.cancelled, stats.pending, stats.confirmed],
      backgroundColor: ['#4CAF50', '#F44336', '#FFA726', '#2196F3'],
      borderWidth: 0,
    }],
  };

  const trendData = {
    labels: stats.monthlyTrend.map(item => item.month),
    datasets: [{
      label: 'Monthly Appointments',
      data: stats.monthlyTrend.map(item => item.count),
      borderColor: '#2196F3',
      backgroundColor: '#2196F3',
      tension: 0.4,
      fill: false,
    }],
  };

  const weeklyData = {
    labels: stats.weeklyDistribution.map(item => item.day),
    datasets: [{
      label: 'Appointments by Day',
      data: stats.weeklyDistribution.map(item => item.count),
      backgroundColor: '#4CAF50',
      borderRadius: 8,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14, weight: '600' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { color: '#666', font: { size: 12 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#666', font: { size: 12 } },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, usePointStyle: true },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14, weight: '600' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const cardData = [
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: Calendar,
      color: "#2196F3",
      subtitle: "All time",
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: CalendarIcon,
      color: "#4CAF50",
      trend: stats.weekTrend,
    },
    {
      title: "This Week",
      value: stats.thisWeekAppointments,
      icon: Activity,
      color: "#FF9800",
      trend: stats.weekTrend,
    },
    {
      title: "This Month",
      value: stats.thisMonthAppointments,
      icon: BarChart3,
      color: "#9C27B0",
      trend: stats.monthTrend,
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "#FFA726",
      subtitle: "Awaiting confirmation",
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircle,
      color: "#4CAF50",
      subtitle: "Ready to go",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: UserCheck,
      color: "#2196F3",
      subtitle: "Successfully finished",
    },
    {
      title: "Completion Rate",
      value: stats.completionRate,
      icon: Star,
      color: "#4CAF50",
      subtitle: "% of appointments completed",
    },
  ];

  return (
    <div className="max-w-full mx-auto mb-6 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Typography variant="h4" className="text-3xl font-bold text-gray-900 mb-2">
          Appointment Analytics Dashboard
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Comprehensive overview of your appointment statistics and trends
        </Typography>
      </motion.div>

      <AppointmentFilter onFilterChange={handleFilterChange} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, cardIndex) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            delay={cardIndex * 0.1}
            trend={card.trend}
            subtitle={card.subtitle}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard title="Appointment Status Distribution" delay={0.2}>
          <Box className="h-[300px]">
            <Bar data={statusChartData} options={chartOptions} />
          </Box>
        </ChartCard>

        <ChartCard title="Status Overview" delay={0.3}>
          <Box className="h-[300px]">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </Box>
        </ChartCard>

        <ChartCard title="Monthly Trend" delay={0.4}>
          <Box className="h-[300px]">
            <Line data={trendData} options={chartOptions} />
          </Box>
        </ChartCard>

        <ChartCard title="Weekly Distribution" delay={0.5}>
          <Box className="h-[300px]">
            <Bar data={weeklyData} options={chartOptions} />
          </Box>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartCard title="Top Departments" delay={0.6}>
          <div className="space-y-3">
            {stats.topDepartments.map((dept) => (
              <div key={dept.name} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{dept.name}</span>
                <span className="font-semibold text-blue-600">{dept.count}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Popular Visit Types" delay={0.7}>
          <div className="space-y-3">
            {stats.topVisitTypes.map((type) => (
              <div key={type.name} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{type.name}</span>
                <span className="font-semibold text-green-600">{type.count}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Top Doctors" delay={0.8}>
          <div className="space-y-3">
            {stats.topDoctors.map((doctor) => (
              <div key={doctor.name} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{doctor.name}</span>
                <span className="font-semibold text-purple-600">{doctor.count}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Time Slot Distribution" delay={0.9}>
          <div className="space-y-3">
            {stats.timeSlotDistribution.map((slot) => (
              <div key={slot.slot} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{slot.slot}</span>
                <span className="font-semibold text-teal-600">{slot.count}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}