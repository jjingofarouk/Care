// incentive/incentiveService.js
import api from '../api';

export const getIncentives = async () => {
  const response = await api.get('/api/incentive');
  return response.data;
};

export const createIncentive = async (data) => {
  const response = await api.post('/api/incentive', data);
  return response.data;
};
