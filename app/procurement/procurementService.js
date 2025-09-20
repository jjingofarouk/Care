// procurement/procurementService.js
import api from '../api';

export const getProcurements = async () => {
  const response = await api.get('/api/procurement');
  return response.data;
};

export const createProcurement = async (data) => {
  const response = await api.post('/api/procurement', data);
  return response.data;
};
