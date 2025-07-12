'use client';
import React, { useState, useEffect } from 'react';
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
          'var(--hospital-caution)', // Amber for Pending
          'var(--hospital-stable)',  // Green for Confirmed
          'var(--hospital-emergency)', // Red for Cancelled
          'var(--hospital-info)',    // Blue for Completed
        ],
        borderColor: [
          'var(--hospital-caution)',
          'var(--hospital-stable)',
          'var(--hospital-emergency)',
          'var(--hospital-info)',
        ],
        borderWidth: 1,
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
        color: 'var(--hospital-gray-900)',
        font: {
          size: 16,
          weight: 'bold',
        },
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
        ticks: { color: 'var(--hospital-gray-700)' },
      },
      x: {
        title: {
          display: true,
          text: 'Status',
          color: 'var(--hospital-gray-900)',
        },
        ticks: { color: 'var(--hospital-gray-700)' },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 mb-2 max-w-full">
      <div className="card">
        <div className="card-header flex items-center gap-2">
          <Clock className="w-5 h-5 text-[var(--hospital-caution)]" />
          <div>
            <h3 className="card-title">Pending</h3>
            <p className="card-subtitle">{stats.pending}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[var(--hospital-stable)]" />
          <div>
            <h3 className="card-title">Confirmed</h3>
            <p className="card-subtitle">{stats.confirmed}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center gap-2">
          <XCircle className="w-5 h-5 text-[var(--hospital-emergency)]" />
          <div>
            <h3 className="card-title">Cancelled</h3>
            <p className="card-subtitle">{stats.cancelled}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[var(--hospital-info)]" />
          <div>
            <h3 className="card-title">Completed</h3>
            <p className="card-subtitle">{stats.completed}</p>
          </div>
        </div>
      </div>

      <div className="card col-span-full p-2">
        <div className="w-full h-64">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}