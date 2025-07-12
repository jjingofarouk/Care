import axios from 'axios';
import api from '../api';

const { BASE_URL, API_ROUTES } = api;

export async function getAdmissions() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.ADT}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admissions:', error);
    throw error;
  }
}

export async function createAdmission(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.ADT}`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating admission:', error);
    throw error;
  }
}

export async function getAdmission(id) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.ADT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admission:', error);
    throw error;
  }
}

export async function updateAdmission(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.ADT}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating admission:', error);
    throw error;
  }
}

export async function deleteAdmission(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.ADT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting admission:', error);
    throw error;
  }
}

export async function getDischarges() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.DISCHARGE}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching discharges:', error);
    throw error;
  }
}

export async function createDischarge(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.DISCHARGE}`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating discharge:', error);
    throw error;
  }
}

export async function getDischarge(id) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.DISCHARGE}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching discharge:', error);
    throw error;
  }
}

export async function updateDischarge(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.DISCHARGE}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating discharge:', error);
    throw error;
  }
}

export async function deleteDischarge(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.DISCHARGE}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting discharge:', error);
    throw error;
  }
}

export async function getPatients() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PATIENT}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}

export async function updatePatient(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.PATIENT}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
}

export async function deletePatient(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.PATIENT}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
}

export async function getDoctors() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.DOCTOR}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
}

export async function updateDoctor(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.DOCTOR}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
}

export async function deleteDoctor(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.DOCTOR}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw error;
  }
}

export async function getWards() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.WARD}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw error;
  }
}

export async function updateWard(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.WARD}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating ward:', error);
    throw error;
  }
}

export async function deleteWard(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.WARD}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting ward:', error);
    throw error;
  }
}

export async function getTransactions() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.TRANSACTION}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

export async function getPayrolls() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PAYROLL}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payrolls:', error);
    throw error;
  }
}