import axios from 'axios';

export const assetsService = {
  async getAssets() {
    try {
      const response = await axios.get('/api/fixed-assets');
      return response.data;
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw new Error('Failed to fetch assets');
    }
  },

  async getAsset(id) {
    try {
      const response = await axios.get(`/api/fixed-assets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching asset:', error);
      throw new Error('Failed to fetch asset');
    }
  },

  async createAsset(data) {
    try {
      const response = await axios.post('/api/fixed-assets', data);
      return response.data;
    } catch (error) {
      console.error('Error creating asset:', error);
      throw new Error('Failed to create asset');
    }
  },

  async deleteAsset(id) {
    try {
      await axios.delete(`/api/fixed-assets/${id}`);
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw new Error('Failed to delete asset');
    }
  },

  async getDepreciationSchedules() {
    try {
      const response = await axios.get('/api/fixed-assets/depreciation');
      return response.data;
    } catch (error) {
      console.error('Error fetching depreciation schedules:', error);
      throw new Error('Failed to fetch depreciation schedules');
    }
  },

  async createDepreciationSchedule(data) {
    try {
      const response = await axios.post('/api/fixed-assets/depreciation', data);
      return response.data;
    } catch (error) {
      console.error('Error creating depreciation schedule:', error);
      throw new Error('Failed to create depreciation schedule');
    }
  },

  async deleteDepreciationSchedule(id) {
    try {
      await axios.delete(`/api/fixed-assets/depreciation/${id}`);
    } catch (error) {
      console.error('Error deleting depreciation schedule:', error);
      throw new Error('Failed to delete depreciation schedule');
    }
  },

  async getAssetAudits() {
    try {
      const response = await axios.get('/api/fixed-assets/audits');
      return response.data;
    } catch (error) {
      console.error('Error fetching asset audits:', error);
      throw new Error('Failed to fetch asset audits');
    }
  },

  async createAssetAudit(data) {
    try {
      const response = await axios.post('/api/fixed-assets/audits', data);
      return response.data;
    } catch (error) {
      console.error('Error creating asset audit:', error);
      throw new Error('Failed to create asset audit');
    }
  },

  async deleteAssetAudit(id) {
    try {
      await axios.delete(`/api/fixed-assets/audits/${id}`);
    } catch (error) {
      console.error('Error deleting asset audit:', error);
      throw new Error('Failed to delete asset audit');
    }
  },

  async getAnalytics() {
    try {
      const response = await axios.get('/api/fixed-assets/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw new Error('Failed to fetch analytics');
    }
  },
};