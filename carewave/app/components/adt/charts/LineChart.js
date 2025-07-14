// app/components/adt/charts/LineChart.js
'use client';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart({ data, title }) {
  const chartData = {
    type: 'line',
    labels: data.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: title,
        data: data.map(item => item.count),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' }, title: { display: true, text: title } },
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}