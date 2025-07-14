// app/components/adt/charts/DoughnutChart.js
'use client';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ data, title }) {
  const chartData = {
    type: 'doughnut',
    labels: data.map(item => item.ward),
    datasets: [
      {
        label: 'Occupancy Rate',
        data: data.map(item => (item.occupiedBeds / item.totalBeds) * 100),
        backgroundColor: ['#1976d2', '#ff9800', '#4caf50', '#f44336'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' }, title: { display: true, text: title } },
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}