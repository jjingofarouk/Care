// utilities/utilitiesService.js
import api from '../api';

export const getUtilities = async () => {
  const response = await api.get('/api/utilities');
  return response.data;
};

export const createUtility = async (data) => {
  const response = await api.post('/api/utilities', data);
  return response.data;
};
