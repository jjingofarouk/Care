// social-service/socialServiceService.js
import api from '../api';

export const getSocialServices = async () => {
  const response = await api.get('/api/social-service');
  return response.data;
};

export const createSocialService = async (data) => {
  const response = await api.post('/api/social-service', data);
  return response.data;
};
