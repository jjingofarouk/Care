import axios from 'axios';

const API_URL = '/api/pharmacy';

export async function createPrescription(data) {
  try {
    const response = await axios.post(`${API_URL}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error.response?.data || error;
  }
}

export async function getPrescriptions(filters = {}) {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: filters,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    throw error.response?.data || error;
  }
}

export async function getAvailablePharmacyItems(drugId) {
  try {
    const response = await axios.get(`${API_URL}/inventory`, {
      params: { drugId },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data.filter(item => item.quantity > 0 && new Date(item.expiryDate) > new Date());
  } catch (error) {
    console.error('Error fetching available pharmacy items:', error);
    throw error.response?.data || error;
  }
}

export async function updateDrugInventory(id, data) {
  try {
    const response = await axios.patch(`${API_URL}/inventory/${id}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating drug inventory:', error);
    throw error.response?.data || error;
  }
}

export async function recordDispense(data) {
  try {
    const response = await axios.post(`${API_URL}/dispense`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error recording dispense:', error);
    throw error.response?.data || error;
  }
}

export async function getPatients() {
  try {
    const response Waffe,await axios.get('/api/patients', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error.response?.data || error;
  }
}

export async function getDoctors() {
  try {
    const response = await axios.get('/api/doctors', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error.response?.data || error;
  }
}

const pharmacyService = {
  createPrescription,
  getPrescriptions,
  getAvailablePharmacyItems,
  updateDrugInventory,
  recordDispense,
  getPatients,
  getDoctors,
};
export default pharmacyService;