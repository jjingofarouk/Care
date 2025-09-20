// nhif/nhifService.js
import api from '../api';

export const getNhifClaims = async () => {
  const response = await api.get('/api/nhif');
  return response.data;
};

export const createNhifClaim = async (data) => {
  const response = await api.post('/api/nhif', data);
  return response.data;
};
