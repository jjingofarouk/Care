import axios from 'axios';
import axiosRetry from 'axios-retry';
import { BASE_URL, API_ROUTES } from '../api';

axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 1000 });

export const getDepartments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.DEPARTMENT}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch departments');
  }
};

export const createDepartment = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.DEPARTMENT}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw new Error(error.response?.data?.message || 'Failed to create department');
  }
};