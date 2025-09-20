// settings/settingsService.js
import api from '../api';

export const getSettings = async () => {
  const response = await api.get('/api/settings');
  return response.data;
};

export const updateSetting = async (data) => {
  const response = await api.post('/api/settings', data);
  return response.data;
};
