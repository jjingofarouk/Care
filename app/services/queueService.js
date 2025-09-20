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

  getPatients: async (searchQuery = '') => {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    params.append('include', 'addresses,nextOfKin,insuranceInfo');
    const response = await axios.get(`/api/queue/patients?${params.toString()}`);
    return response.data;
  },

  getServiceCounters: async () => {
    const response = await axios.get('/api/queue/service-counters');
    return response.data;
  },

  getServiceCounterById: async (id) => {
    const response = await axios.get(`/api/queue/service-counters/${id}`);
    return response.data;
  },

  createServiceCounter: async (data) => {
    const response = await axios.post('/api/queue/service-counters', data);
    return response.data;
  },

  updateServiceCounter: async (id, data) => {
    const response = await axios.put(`/api/queue/service-counters/${id}`, data);
    return response.data;
  },

  deleteServiceCounter: async (id) => {
    await axios.delete(`/api/queue/service-counters/${id}`);
  },

  getQueueStatuses: async () => {
    const response = await axios.get('/api/queue/statuses');
    return response.data;
  },

  getQueueStatusById: async (id) => {
    const response = await axios.get(`/api/queue/statuses/${id}`);
    return response.data;
  },

  createQueueStatus: async (data) => {
    const response = await axios.post('/api/queue/statuses', data);
    return response.data;
  },

  updateQueueStatus: async (id, data) => {
    const response = await axios.put(`/api/queue/statuses/${id}`, data);
    return response.data;
  },

  deleteQueueStatus: async (id) => {
    await axios.delete(`/api/queue/statuses/${id}`);
  },

  getDepartments: async () => {
    const response = await axios.get('/api/queue/departments');
    return response.data;
  },
};

export default queueService;