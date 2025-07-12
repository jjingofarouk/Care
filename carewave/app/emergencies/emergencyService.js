// emergency/emergencyService.js
import api from '../api';

export const getEmergencies = async () => {
  const response = await api.get('/api/emergency');
  return response.data;
};

export const createEmergency = async (data) => {
  const response = await api.post('/api/emergency', data);
  return response.data;
};
