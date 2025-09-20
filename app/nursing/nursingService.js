// nursing/nursingService.js
import api from '../api';

export const getNursingCares = async () => {
  const response = await api.get('/api/nursing');
  return response.data;
};

export const createNursingCare = async (data) => {
  const response = await api.post('/api/nursing', data);
  return response.data;
};
