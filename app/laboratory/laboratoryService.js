// laboratory/laboratoryService.js
import api from '../api';

export const getLaboratoryTests = async () => {
  const response = await api.get('/api/laboratory');
  return response.data;
};

export const createLaboratoryTest = async (data) => {
  const response = await api.post('/api/laboratory', data);
  return response.data;
};
