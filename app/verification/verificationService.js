// verification/verificationService.js
import api from '../api';

export const getVerifications = async () => {
  const response = await api.get('/api/verification');
  return response.data;
};

export const createVerification = async (data) => {
  const response = await api.post('/api/verification', data);
  return response.data;
};
