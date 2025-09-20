// helpdesk/helpdeskService.js
import api from '../api';

export const getHelpdeskTickets = async () => {
  const response = await api.get('/api/helpdesk');
  return response.data;
};

export const createHelpdeskTicket = async (data) => {
  const response = await api.post('/api/helpdesk', data);
  return response.data;
};
