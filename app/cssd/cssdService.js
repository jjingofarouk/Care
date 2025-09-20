import { API_ROUTES, BASE_URL } from '../api';

export async function getCssdRecords() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch CSSD records');
  }
  return response.json();
}

export async function createCssdRecord(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ ...data, userId: 1 }), // Replace with actual user ID
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create CSSD record');
  }
  return response.json();
}

export async function updateCssdRecord(id, data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ ...data, userId: 1 }), // Replace with actual user ID
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update CSSD record');
  }
  return response.json();
}

export async function deleteCssdRecord(id) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete CSSD record');
  }
  return response.json();
}

export async function getInstruments() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/instruments`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch instruments');
  }
  return response.json();
}

export async function createInstrument(data) {
  const sanitizedData = {
    name: data.name?.trim(),
    serialNumber: data.serialNumber?.trim(),
    type: data.type?.trim() || null,
    status: data.status || 'AVAILABLE',
    lastSterilized: data.lastSterilized ? new Date(data.lastSterilized).toISOString() : null,
    location: data.location?.trim() || null,
    stockQuantity: parseInt(data.stockQuantity) || 1,
    minStockThreshold: parseInt(data.minStockThreshold) || 1,
    userId: 1, // Replace with actual user ID from auth
  };

  if (!sanitizedData.name || !sanitizedData.serialNumber) {
    throw new Error('Name and serial number are required');
  }

  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/instruments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(sanitizedData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create instrument');
  }

  return response.json();
}

export async function deleteInstrument(id) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/instruments/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete instrument');
  }
  return response.json();
}

export async function getRequisitions() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/requisitions`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch requisitions');
  }
  return response.json();
}

export async function createRequisition(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/requisitions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ ...data, userId: 1 }), // Replace with actual user ID
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create requisition');
  }
  return response.json();
}

export async function updateRequisition(id, data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/requisitions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ ...data, userId: 1 }), // Replace with actual user ID
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update requisition');
  }
  return response.json();
}

export async function deleteRequisition(id) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/requisitions/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete requisition');
  }
  return response.json();
}

export async function getCssdLogs() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CSSD}/logs`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch logs');
  }
  return response.json();
}