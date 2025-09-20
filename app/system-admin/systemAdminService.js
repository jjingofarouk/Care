// system-admin/systemAdminService.js
import api from '../api';

export const getSystemAdmins = async () => {
  const response = await api.get('/api/system-admin');
  return response.data;
};

export const createSystemAdmin = async (data) => {
  const response = await api.post('/api/system-admin', data);
  return response.data;
};
