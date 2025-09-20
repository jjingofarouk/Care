// fixed-assets/fixedAssetsService.js
import api from '../api';

export const getFixedAssets = async () => {
  const response = await api.get('/api/fixed-assets');
  return response.data;
};

export const createFixedAsset = async (data) => {
  const response = await api.post('/api/fixed-assets', data);
  return response.data;
};
