// app/services/radiologyService.js
import axios from 'axios';

export async function getRadiologyTests(page = 1, pageSize = 10, search = '') {
  try {
    const response = await axios.get(`/api/radiology/tests?page=${page}&pageSize=${pageSize}&search=${search}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch radiology tests');
  }
}

export async function getRadiologyTest(id) {
  try {
    const response = await axios.get(`/api/radiology/tests/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch radiology test');
  }
}

export async function createRadiologyTest(data) {
  try {
    const response = await axios.post('/api/radiology/tests', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create radiology test');
  }
}

export async function updateRadiologyTest(id, data) {
  try {
    const response = await axios.put(`/api/radiology/tests/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update radiology test');
  }
}

export async function deleteRadiologyTest(id) {
  try {
    const response = await axios.delete(`/api/radiology/tests/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete radiology test');
  }
}

export async function getImagingOrders(page = 1, pageSize = 10, search = '') {
  try {
    const response = await axios.get(`/api/radiology/orders?page=${page}&pageSize=${pageSize}&search=${search}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch imaging orders');
  }
}

export async function getImagingOrder(id) {
  try {
    const response = await axios.get(`/api/radiology/orders/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch imaging order');
  }
}

export async function createImagingOrder(data) {
  try {
    const response = await axios.post('/api/radiology/orders', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create imaging order');
  }
}

export async function updateImagingOrder(id, data) {
  try {
    const response = await axios.put(`/api/radiology/orders/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update imaging order');
  }
}

export async function deleteImagingOrder(id) {
  try {
    const response = await axios.delete(`/api/radiology/orders/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete imaging order');
  }
}

export async function getRadiologyResults(page = 1, pageSize = 10, search = '') {
  try {
    const response = await axios.get(`/api/radiology/results?page=${page}&pageSize=${pageSize}&search=${search}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch radiology results');
  }
}

export async function getRadiologyResult(id) {
  try {
    const response = await axios.get(`/api/radiology/results/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch radiology result');
  }
}

export async function createRadiologyResult(data) {
  try {
    const response = await axios.post('/api/radiology/results', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create radiology result');
  }
}

export async function updateRadiologyResult(id, data) {
  try {
    const response = await axios.put(`/api/radiology/results/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update radiology result');
  }
}

export async function deleteRadiologyResult(id) {
  try {
    const response = await axios.delete(`/api/radiology/results/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete radiology result');
  }
}

export async function getScanImages(page = 1, pageSize = 10) {
  try {
    const response = await axios.get(`/api/radiology/scan-images?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch scan images');
  }
}

export async function getScanImage(id) {
  try {
    const response = await axios.get(`/api/radiology/scan-images/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch scan image');
  }
}

export async function createScanImage(data) {
  try {
    const response = await axios.post('/api/radiology/scan-images', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create scan image');
  }
}

export async function updateScanImage(id, data) {
  try {
    const response = await axios.put(`/api/radiology/scan-images/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update scan image');
  }
}

export async function deleteScanImage(id) {
  try {
    const response = await axios.delete(`/api/radiology/scan-images/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete scan image');
  }
}

export async function validatePatientId(patientId) {
  try {
    const response = await axios.get(`/api/patients/${patientId}/validate`);
    return response.data.exists;
  } catch (error) {
    console.error('Patient validation error:', error);
    return false;
  }
}

export async function getPatientInfo(patientId) {
  try {
    const response = await axios.get(`/api/patients/${patientId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch patient information');
  }
}
