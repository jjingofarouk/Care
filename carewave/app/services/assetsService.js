import axios from 'axios';

export const assetsService = {
  async getAssets() {
    const response = await axios.get('/api/fixed-assets');
    return response.data;
  },

  async getAsset(id) {
    const response = await axios.get(`/api/fixed-assets/${id}`);
    return response.data;
  },

  async createAsset(data) {
    const response = await axios.post('/api/fixed-assets', data);
    return response.data;
  },

  async deleteAsset(id) {
    await axios.delete(`/api/fixed-assets/${id}`);
  },

  async getDepreciationSchedules() {
    const response = await axios.get('/api/fixed-assets/depreciation');
    return response.data;
  },

  async createDepreciationSchedule(data) {
    const response = await axios.post('/api/fixed-assets/depreciation', data);
    return response.data;
  },

  async deleteDepreciationSchedule(id) {
    await axios.delete(`/api/fixed-assets/depreciation/${id}`);
  },

  async getAssetAudits() {
    const response = await axios.get('/api/fixed-assets/audits');
    return response.data;
  },

  async createAssetAudit(data) {
    const response = await axios.post('/api/fixed-assets/audits', data);
    return response.data;
  },

  async deleteAssetAudit(id) {
    await axios.delete(`/api/fixed-assets/audits/${id}`);
  },

  async getAnalytics() {
    const response = await axios.get('/api/fixed-assets/analytics');
    return response.data;
  },
};