import axios from 'axios';

export async function getLabTests() {
  try {
    const response = await axios.get('/api/laboratory/tests');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab tests');
  }
}

export async function getLabTest(id) {
  try {
    const response = await axios.get(`/api/laboratory/tests/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab test');
  }
}

export async function createLabTest(data) {
  try {
    const response = await axios.post('/api/laboratory/tests', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create lab test');
  }
}

export async function updateLabTest(id, data) {
  try {
    const response = await axios.put(`/api/laboratory/tests/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update lab test');
  }
}

export async function deleteLabTest(id) {
  try {
    const response = await axios.delete(`/api/laboratory/tests/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete lab test');
  }
}

export async function getLabRequests() {
  try {
    const response = await axios.get('/api/laboratory/requests');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab requests');
  }
}

export async function getLabRequest(id) {
  try {
    const response = await axios.get(`/api/laboratory/requests/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab request');
  }
}

export async function createLabRequest(data) {
  try {
    const response = await axios.post('/api/laboratory/requests', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create lab request');
  }
}

export async function updateLabRequest(id, data) {
  try {
    const response = await axios.put(`/api/laboratory/requests/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update lab request');
  }
}

export async function deleteLabRequest(id) {
  try {
    const response = await axios.delete(`/api/laboratory/requests/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete lab request');
  }
}

export async function getLabResults() {
  try {
    const response = await axios.get('/api/laboratory/results');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab results');
  }
}

export async function getLabResult(id) {
  try {
    const response = await axios.get(`/api/laboratory/results/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab result');
  }
}

export async function createLabResult(data) {
  try {
    const response = await axios.post('/api/laboratory/results', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create lab result');
  }
}

export async function updateLabResult(id, data) {
  try {
    const response = await axios.put(`/api/laboratory/results/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update lab result');
  }
}

export async function deleteLabResult(id) {
  try {
    const response = await axios.delete(`/api/laboratory/results/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete lab result');
  }
}

export async function getSamples() {
  try {
    const response = await axios.get('/api/laboratory/samples');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch samples');
  }
}

// Fixed: Add function to get samples by patient ID
export async function getSamplesByPatient(patientId) {
  try {
    const response = await axios.get(`/api/laboratory/samples/patient/${patientId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch patient samples');
  }
}

export async function getSample(id) {
  try {
    const response = await axios.get(`/api/laboratory/samples/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch sample');
  }
}

export async function createSample(data) {
  try {
    const response = await axios.post('/api/laboratory/samples', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create sample');
  }
}

export async function updateSample(id, data) {
  try {
    const response = await axios.put(`/api/laboratory/samples/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update sample');
  }
}

export async function deleteSample(id) {
  try {
    const response = await axios.delete(`/api/laboratory/samples/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete sample');
  }
}

// Fixed: Proper patient validation function
export async function validatePatientId(patientId) {
  try {
    const response = await axios.get(`/api/patients/${patientId}/validate`);
    return response.data.exists;
  } catch (error) {
    console.error('Patient validation error:', error);
    return false;
  }
}

// Additional helper function to get patient info
export async function getPatientInfo(patientId) {
  try {
    const response = await axios.get(`/api/patients/${patientId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch patient information');
  }
}