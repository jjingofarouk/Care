
// pharmacy/PharmacyReports.jsx
// Reporting component for stock and sales

import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, Button } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { generateStockReport, generateSalesReport } from './pharmacyService';
import styles from './PharmacyReports.module.css';

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const PharmacyReports = () => {
  const [reportType, setReportType] = useState('stock');
  const [timeRange, setTimeRange] = useState('monthly');
  const [stockData, setStockData] = useState(null);
  const [salesData, setSalesData] = useState(null);

  const handleGenerateReport = async () => {
    if (reportType === 'stock') {
      const data = await generateStockReport(timeRange);
      setStockData({
        labels: data.map(item => item.name),
        datasets: [{
          label: 'Stock Levels',
          data: data.map(item => item.stockQuantity),
          backgroundColor: ['#2196F3', '#4CAF50', '#FFC107', '#F44336'],
          borderColor: ['#1976D2', '#388E3C', '#FFA000', '#D32F2F'],
          borderWidth: 1,
        }],
      });
    } else {
      const data = await generateSalesReport(timeRange);
      setSalesData({
        labels: [...new Set(data.map(item => new Date(item.dispensedDate).toLocaleDateString()))],
        datasets: [{
          label: 'Sales',
          data: data.reduce((acc, item) => {
            const date = new Date(item.dispensedDate).toLocaleDateString();
            acc[date] = (acc[date] || 0) + item.quantity;
            return acc;
          }, {}),
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          fill: true,
        }],
      });
    }
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Reports</Typography>
      <Box className={styles.controls}>
        <Select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className={styles.select}
        >
          <MenuItem value="stock">Stock Report</MenuItem>
          <MenuItem value="sales">Sales Report</MenuItem>
        </Select>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={styles.select}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleGenerateReport}>
          Generate Report
        </Button>
      </Box>
      {reportType === 'stock' && stockData && <Bar data={stockData} options={chartOptions} />}
      {reportType === 'sales' && salesData && <Line data={salesData} options={chartOptions} />}
    </Box>
  );
};

export default PharmacyReports;