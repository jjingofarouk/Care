import axios from 'axios';

const queueService = {
  getAll: async () => {
    const response = await axios.get('/api/queue');
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`/api/queue/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axios.post('/api/queue', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axios.put(`/api/queue/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await axios.delete(`/api/queue/${id}`);
  },

  getPatients: async () => {
    const response = await axios.get('/api/patients');
    return response.data;
  },

  getServiceCounters: async () => {
    const response = await axios.get('/api/service-counters');
    return response.data;
  },

  getQueueStatuses: async () => {
    const response = await axios.get('/api/queue-statuses');
    return response.data;
  },
};

export default queueService;
