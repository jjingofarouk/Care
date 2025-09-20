// maternity/maternityService.js
import api from '../api';

export const getMaternities = async () => {
  const response = await api.get('/api/maternity');
  return response.data;
};

export const createMaternity = async (data) => {
  const response = await api.post('/api/maternity', data);
  return response.data;
};
