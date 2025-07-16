// app/services/vaccinationService.js
import axios from 'axios';

export const vaccinationService = {
  async getVaccinations() {
    const response = await axios.get('/api/vaccination');
    return response.data;
  },

  async getVaccination(id) {
    const response = await axios.get(`/api/vaccination/${id}`);
    return response.data;
  },

  async createVaccination(data) {
    const response = await axios.post('/api/vaccination', data);
    return response.data;
  },

  async updateVaccination(id, data) {
    const response = await axios.put(`/api/vaccination/${id}`, data);
    return response.data;
  },

  async deleteVaccination(id) {
    const response = await axios.delete(`/api/vaccination/${id}`);
    return response.data;
  },

  async getVaccines() {
    const response = await axios.get('/api/vaccination/vaccines');
    return response.data;
  },

  async getSchedules() {
    const response = await axios.get('/api/vaccination/schedules');
    return response.data;
  },
};