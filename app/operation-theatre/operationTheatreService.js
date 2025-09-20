// operation-theatre/operationTheatreService.js
import api from '../api';

export const getSurgeries = async () => {
  const response = await api.get('/api/operation-theatre');
  return response.data;
};

export const createSurgery = async (data) => {
  const response = await api.post('/api/operation-theatre', data);
  return response.data;
};
