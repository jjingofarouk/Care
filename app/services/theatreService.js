import axios from 'axios';

export async function getTheatres(page = 1, pageSize = 10, search = '') {
  try {
    const response = await axios.get(`/api/operation-theatre/theatres?page=${page}&pageSize=${pageSize}&search=${search}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch theatres');
  }
}

export async function getTheatre(id) {
  try {
    const response = await axios.get(`/api/operation-theatre/theatres/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch theatre');
  }
}

export async function createTheatre(data) {
  try {
    const response = await axios.post('/api/operation-theatre/theatres', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create theatre');
  }
}

export async function updateTheatre(id, data) {
  try {
    const response = await axios.put(`/api/operation-theatre/theatres/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update theatre');
  }
}

export async function deleteTheatre(id) {
  try {
    const response = await axios.delete(`/api/operation-theatre/theatres/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete theatre');
  }
}

export async function getSurgicalTeams(page = 1, pageSize = 10, search = '') {
  try {
    const response = await axios.get(`/api/operation-theatre/surgical-teams?page=${page}&pageSize=${pageSize}&search=${search}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch surgical teams');
  }
}

export async function getSurgicalTeam(id) {
  try {
    const response = await axios.get(`/api/operation-theatre/surgical-teams/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch surgical team');
  }
}

export async function createSurgicalTeam(data) {
  try {
    const response = await axios.post('/api/operation-theatre/surgical-teams', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create surgical team');
  }
}

export async function updateSurgicalTeam(id, data) {
  try {
    const response = await axios.put(`/api/operation-theatre/surgical-teams/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update surgical team');
  }
}

export async function deleteSurgicalTeam(id) {
  try {
    const response = await axios.delete(`/api/operation-theatre/surgical-teams/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete surgical team');
  }
}

export async function getSurgeries(page = 1, pageSize = 10, search = '') {
  try {
    const response = await axios.get(`/api/operation-theatre/surgeries?page=${page}&pageSize=${pageSize}&search=${search}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch surgeries');
  }
}

export async function getSurgery(id) {
  try {
    const response = await axios.get(`/api/operation-theatre/surgeries/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch surgery');
  }
}

export async function createSurgery(data) {
  try {
    const response = await axios.post('/api/operation-theatre/surgeries', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create surgery');
  }
}

export async function updateSurgery(id, data) {
  try {
    const response = await axios.put(`/api/operation-theatre/surgeries/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update surgery');
  }
}

export async function deleteSurgery(id) {
  try {
    const response = await axios.delete(`/api/operation-theatre/surgeries/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete surgery');
  }
}

export async function getPreOpAssessments(page = 1, pageSize = 10, search = '') {
  try {
    const response = await axios.get(`/api/operation-theatre/pre-op-assessments?page=${page}&pageSize=${pageSize}&search=${search}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch pre-op assessments');
  }
}

export async function getPreOpAssessment(id) {
  try {
    const response = await axios.get(`/api/operation-theatre/pre-op-assessments/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch pre-op assessment');
  }
}

export async function createPreOpAssessment(data) {
  try {
    const response = await axios.post('/api/operation-theatre/pre-op-assessments', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create pre-op assessment');
  }
}

export async function updatePreOpAssessment(id, data) {
  try {
    const response = await axios.put(`/api/operation-theatre/pre-op-assessments/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update pre-op assessment');
  }
}

export async function deletePreOpAssessment(id) {
  try {
    const response = await axios.delete(`/api/operation-theatre/pre-op-assessments/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete pre-op assessment');
  }
}

export async function getAnesthesiaRecords(page = 1, pageSize = 10, search = '') {
  try {
    const response = await axios.get(`/api/operation-theatre/anesthesia-records?page=${page}&pageSize=${pageSize}&search=${search}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch anesthesia records');
  }
}

export async function getAnesthesiaRecord(id) {
  try {
    const response = await axios.get(`/api/operation-theatre/anesthesia-records/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch anesthesia record');
  }
}

export async function createAnesthesiaRecord(data) {
  try {
    const response = await axios.post('/api/operation-theatre/anesthesia-records', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create anesthesia record');
  }
}

export async function updateAnesthesiaRecord(id, data) {
  try {
    const response = await axios.put(`/api/operation-theatre/anesthesia-records/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update anesthesia record');
  }
}

export async function deleteAnesthesiaRecord(id) {
  try {
    const response = await axios.delete(`/api/operation-theatre/anesthesia-records/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete anesthesia record');
  }
}

export async function getPostOpRecoveries(page = 1, pageSize = 10, search = '') {
  try {
    const response = await axios.get(`/api/operation-theatre/post-op-recovery?page=${page}&pageSize=${pageSize}&search=${search}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch post-op recoveries');
  }
}

export async function getPostOpRecovery(id) {
  try {
    const response = await axios.get(`/api/operation-theatre/post-op-recovery/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch post-op recovery');
  }
}

export async function createPostOpRecovery(data) {
  try {
    const response = await axios.post('/api/operation-theatre/post-op-recovery', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create post-op recovery');
  }
}

export async function updatePostOpRecovery(id, data) {
  try {
    const response = await axios.put(`/api/operation-theatre/post-op-recovery/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update post-op recovery');
  }
}

export async function deletePostOpRecovery(id) {
  try {
    const response = await axios.delete(`/api/operation-theatre/post-op-recovery/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete post-op recovery');
  }
}

export async function getSurgeryAuditLogs(page = 1, pageSize = 10, search = '') {
  try {
    const response = await axios.get(`/api/operation-theatre/surgery-audit-logs?page=${page}&pageSize=${pageSize}&search=${search}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch surgery audit logs');
  }
}

export async function getSurgeryAuditLog(id) {
  try {
    const response = await axios.get(`/api/operation-theatre/surgery-audit-logs/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch surgery audit log');
  }
}

export async function createSurgeryAuditLog(data) {
  try {
    const response = await axios.post('/api/operation-theatre/surgery-audit-logs', data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create surgery audit log');
  }
}

export async function updateSurgeryAuditLog(id, data) {
  try {
    const response = await axios.put(`/api/operation-theatre/surgery-audit-logs/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update surgery audit log');
  }
}

export async function deleteSurgeryAuditLog(id) {
  try {
    const response = await axios.delete(`/api/operation-theatre/surgery-audit-logs/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete surgery audit log');
  }
}
