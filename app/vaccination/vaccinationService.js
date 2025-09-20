// vaccination/vaccinationService.js
import api from '../api';

export const getVaccinations = async () => {
  const response = await api.get('/api/vaccination');
  return response.data;
};

export const createVaccination = async (data) => {
  const response = await api.post('/api/vaccination', data);
  return response.data;
};
