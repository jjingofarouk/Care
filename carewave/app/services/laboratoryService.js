import axios from 'axios';

export async function getLabTests() {
  try {
    const response = await axios.get('/api/laboratory/requests?resource=labTests');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab tests');
  }
}

export async function getLabTest(id) {
  try {
    const response = await axios.get(`/api/laboratory/requests?resource=labTests&id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab test');
  }
}

export async function createLabTest(data) {
  try {
    const response = await axios.post('/api/laboratory/requests', { resource: 'labTest', ...data });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create lab test');
  }
}

export async function updateLabTest(id, data) {
  try {
    const response = await axios.put(`/api/laboratory/requests?id=${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update lab test');
  }
}

export async function deleteLabTest(id) {
  try {
    const response = await axios.delete(`/api/laboratory/requests?id=${id}`);
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
    const response = await axios.get(`/api/laboratory/requests?resource=labRequest&id=${id}`);
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
    const response = await axios.put(`/api/laboratory/requests?id=${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update lab request');
  }
}

export async function deleteLabRequest(id) {
  try {
    const response = await axios.delete(`/api/laboratory/requests?id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete lab request');
  }
}

export async function getLabResults() {
  try {
    const response = await axios.get('/api/laboratory/requests?resource=labResults');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab results');
  }
}

export async function getLabResult(id) {
  try {
    const response = await axios.get(`/api/laboratory/requests?resource=labResult&id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch lab result');
  }
}

export async function createLabResult(data) {
  try {
    const response = await axios.post('/api/laboratory/requests', { resource: 'labResult', ...data });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create lab result');
  }
}

export async function updateLabResult(id, data) {
  try {
    const response = await axios.put(`/api/laboratory/requests?id=${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update lab result');
  }
}

export async function deleteLabResult(id) {
  try {
    const response = await axios.delete(`/api/laboratory/requests?id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete lab result');
  }
}

export async function getSamples() {
  try {
    const response = await axios.get('/api/laboratory/requests?resource=samples');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch samples');
  }
}

export async function getSample(id) {
  try {
    const response = await axios.get(`/api/laboratory/requests?resource=sample&id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch sample');
  }
}

export async function createSample(data) {
  try {
    const response = await axios.post('/api/laboratory/requests', { resource: 'sample', ...data });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create sample');
  }
}

export async function updateSample(id, data) {
  try {
    const response = await axios.put(`/api/laboratory/requests?id=${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update sample');
  }
}

export async function deleteSample(id) {
  try {
    const response = await axios.delete(`/api/laboratory/requests?id=${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete sample');
  }
}
