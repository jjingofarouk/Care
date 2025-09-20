// substore/substoreService.js
import api from '../api';

export const getSubstoreItems = async () => {
  const response = await api.get('/api/substore');
  return response.data;
};

export const createSubstoreItem = async (data) => {
  const response = await api.post('/api/substore', data);
  return response.data;
};
