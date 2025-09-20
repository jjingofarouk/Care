// app/components/adt/charts/BarChart.js
'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BarChart({ data, title, labelKey = 'ward', valueKey = 'count' }) {
  const chartData = {
    type: 'bar',
    labels: data.map(item => item[labelKey]),
    datasets: [
      {
        label: title,
        data: data.map(item => item[valueKey]),
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
      <Bar data={chartData} options={options} />
    </div>
  );
}