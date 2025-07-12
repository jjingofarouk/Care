'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  TrendingUp, 
  Users, 
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
          
          {/* Decorative elements */}
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
    busyDays: [],
    doctorUtilization: [],
    completionRate: 0,
    cancellationRate: 0,
    noShowRate: 0,
    monthlyTrend: [],
    weeklyDistribution: [],
    timeSlotDistribution: [],
    patientReturnRate: 0,
    avgWaitTime: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/appointments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        
        if (!response.ok) throw new Error('Failed to fetch appointments');
        
        const appointments = await response.json();
        
        // Calculate comprehensive statistics
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // Basic status counts
        const statusCounts = appointments.reduce(
          (acc, appt) => {
            const status = appt.appointmentStatus?.toLowerCase() || 'pending';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          },
          { pending: 0, confirmed: 0, cancelled: 0, completed: 0 }
        );

        // Time-based counts
        const todayAppointments = appointments.filter(appt => 
          new Date(appt.appointmentDate) >= today
        ).length;
        
        const thisWeekAppointments = appointments.filter(appt => 
          new Date(appt.appointmentDate) >= thisWeek
        ).length;
        
        const thisMonthAppointments = appointments.filter(appt => 
          new Date(appt.appointmentDate) >= thisMonth
        ).length;

        // Department analysis
        const departmentCounts = appointments.reduce((acc, appt) => {
          const dept = appt.doctor?.department?.name || 'Unknown';
          acc[dept] = (acc[dept] || 0) + 1;
          return acc;
        }, {});
        
        const topDepartments = Object.entries(departmentCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));

        // Visit type analysis
        const visitTypeCounts = appointments.reduce((acc, appt) => {
          const visitType = appt.visitType?.name || 'Unknown';
          acc[visitType] = (acc[visitType] || 0) + 1;
          return acc;
        }, {});
        
        const topVisitTypes = Object.entries(visitTypeCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));

        // Doctor analysis
        const doctorCounts = appointments.reduce((acc, appt) => {
          if (appt.doctor) {
            const doctorName = appt.doctor.name || `${appt.doctor.firstName} ${appt.doctor.lastName}`;
            acc[doctorName] = (acc[doctorName] || 0) + 1;
          }
          return acc;
        }, {});
        
        const topDoctors = Object.entries(doctorCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));

        // Calculate rates
        const totalAppointments = appointments.length;
        const completionRate = totalAppointments > 0 ? 
          ((statusCounts.completed / totalAppointments) * 100).toFixed(1) : 0;
        const cancellationRate = totalAppointments > 0 ? 
          ((statusCounts.cancelled / totalAppointments) * 100).toFixed(1) : 0;

        // Weekly distribution
        const weeklyDistribution = Array.from({ length: 7 }, (_, i) => {
          const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i];
          const count = appointments.filter(appt => 
            new Date(appt.appointmentDate).getDay() === i
          ).length;
          return { day: dayName, count };
        });

        // Monthly trend (last 6 months)
        const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = date.toLocaleDateString('en-US', { month: 'short' });
          const count = appointments.filter(appt => {
            const apptDate = new Date(appt.appointmentDate);
            return apptDate.getMonth() === date.getMonth() && 
                   apptDate.getFullYear() === date.getFullYear();
          }).length;
          return { month: monthName, count };
        }).reverse();

        // Time slot distribution
        const timeSlotDistribution = appointments.reduce((acc, appt) => {
          const hour = new Date(appt.appointmentDate).getHours();
          let timeSlot;
          if (hour < 6) timeSlot = 'Early Morning (12-6 AM)';
          else if (hour < 12) timeSlot = 'Morning (6-12 PM)';
          else if (hour < 17) timeSlot = 'Afternoon (12-5 PM)';
          else timeSlot = 'Evening (5-11 PM)';
          
          acc[timeSlot] = (acc[timeSlot] || 0) + 1;
          return acc;
        }, {});

        const avgAppointmentsPerDay = totalAppointments > 0 ? 
          Math.round(totalAppointments / 30) : 0; // Rough estimate

        setStats({
          ...statusCounts,
          totalAppointments,
          todayAppointments,
          thisWeekAppointments,
          thisMonthAppointments,
          topDepartments,
          topVisitTypes,
          topDoctors,
          avgAppointmentsPerDay,
          completionRate: parseFloat(completionRate),
          cancellationRate: parseFloat(cancellationRate),
          monthlyTrend,
          weeklyDistribution,
          timeSlotDistribution: Object.entries(timeSlotDistribution)
            .map(([slot, count]) => ({ slot, count })),
          patientReturnRate: 85, // Mock data - would need patient history analysis
          avgWaitTime: 15, // Mock data - would need actual wait time tracking
        });
        
      } catch (err) {
        console.error('Error fetching appointment stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
      backgroundColor: [
        '#FFA726', '#4CAF50', '#F44336', '#2196F3'
      ],
      borderColor: [
        '#FF9800', '#4CAF50', '#F44336', '#2196F3'
      ],
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
      subtitle: "All time"
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: CalendarIcon,
      color: "#4CAF50",
      trend: "+12%"
    },
    {
      title: "This Week",
      value: stats.thisWeekAppointments,
      icon: Activity,
      color: "#FF9800",
      trend: "+8%"
    },
    {
      title: "This Month",
      value: stats.thisMonthAppointments,
      icon: BarChart3,
      color: "#9C27B0",
      trend: "+15%"
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "#FFA726",
      subtitle: "Awaiting confirmation"
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      icon: CheckCircle,
      color: "#4CAF50",
      subtitle: "Ready to go"
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: UserCheck,
      color: "#2196F3",
      subtitle: "Successfully finished"
    },
    {
      title: "Completion Rate",
      value: stats.completionRate,
      icon: Star,
      color: "#4CAF50",
      subtitle: "% of appointments completed"
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
        <Typography variant="h4" className="text-3xl font-bold text-gray-900 mb-2">
          Appointment Analytics Dashboard
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Comprehensive overview of your appointment statistics and trends
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
            subtitle={card.subtitle}
          />
        ))}
      </div>

      {/* Charts Grid */}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartCard title="Top Departments" delay={0.6}>
          <div className="space-y-3">
            {stats.topDepartments.map((dept, index) => (
              <div key={dept.name} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{dept.name}</span>
                <span className="font-semibold text-blue-600">{dept.count}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Popular Visit Types" delay={0.7}>
          <div className="space-y-3">
            {stats.topVisitTypes.map((type, index) => (
              <div key={type.name} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{type.name}</span>
                <span className="font-semibold text-green-600">{type.count}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Top Doctors" delay={0.8}>
          <div className="space-y-3">
            {stats.topDoctors.map((doctor, index) => (
              <div key={doctor.name} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{doctor.name}</span>
                <span className="font-semibold text-purple-600">{doctor.count}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}