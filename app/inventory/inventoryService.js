// inventory/inventoryService.js
import api from '../api';

export const getInventoryItems = async () => {
  const response = await api.get('/api/inventory');
  return response.data;
};

export const createInventoryItem = async (data) => {
  const response = await api.post('/api/inventory', data);
  return response.data;
};
