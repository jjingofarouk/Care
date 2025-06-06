import axios from 'axios';
import api from '../api';

const { BASE_URL, API_ROUTES } = api;

export async function getPatients() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PATIENT}?include=user`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}

export async function updatePatient(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.PATIENT}?id=${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
}

export async function deletePatient(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.PATIENT}?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
}

export async function createPatient(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PATIENT}`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
}