// mkt-referral/mktReferralService.js
import api from '../api';

export const getReferrals = async () => {
  const response = await api.get('/api/mkt-referral');
  return response.data;
};

export const createReferral = async (data) => {
  const response = await api.post('/api/mkt-referral', data);
  return response.data;
};
