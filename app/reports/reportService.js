// reports/reportService.js
import api from '../api';

export const getReports = async () => {
  const response = await api.get('/api/reports');
  return response.data;
};

export const generateReport = async (data) => {
  const response = await api.post('/api/reports', data);
  return response.data;
};
