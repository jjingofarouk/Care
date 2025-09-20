import axios from 'axios';

const BASE_URL = '/api/clinical';

export async function getClinicalNotes() {
  try {
    const response = await axios.get(`${BASE_URL}/notes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching clinical notes:', error);
    throw error;
  }
}

export async function getClinicalNote(id) {
  try {
    const response = await axios.get(`${BASE_URL}/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching clinical note:', error);
    throw error;
  }
}

export async function createClinicalNote(data) {
  try {
    const response = await axios.post(`${BASE_URL}/notes`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating clinical note:', error);
    throw error;
  }
}

export async function updateClinicalNote(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}/notes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating clinical note:', error);
    throw error;
  }
}

export async function deleteClinicalNote(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting clinical note:', error);
    throw error;
  }
}

export async function getProgressNotes() {
  try {
    const response = await axios.get(`${BASE_URL}/progress`);
    return response.data;
  } catch (error) {
    console.error('Error fetching progress notes:', error);
    throw error;
  }
}

export async function getProgressNote(id) {
  try {
    const response = await axios.get(`${BASE_URL}/progress/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching progress note:', error);
    throw error;
  }
}

export async function createProgressNote(data) {
  try {
    const response = await axios.post(`${BASE_URL}/progress`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating progress note:', error);
    throw error;
  }
}

export async function updateProgressNote(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}/progress/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating progress note:', error);
    throw error;
  }
}

export async function deleteProgressNote(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/progress/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting progress note:', error);
    throw error;
  }
}

export async function getSOAPNotes() {
  try {
    const response = await axios.get(`${BASE_URL}/soap`);
    return response.data;
  } catch (error) {
    console.error('Error fetching SOAP notes:', error);
    throw error;
  }
}

export async function getSOAPNote(id) {
  try {
    const response = await axios.get(`${BASE_URL}/soap/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching SOAP note:', error);
    throw error;
  }
}

export async function createSOAPNote(data) {
  try {
    const response = await axios.post(`${BASE_URL}/soap`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating SOAP note:', error);
    throw error;
  }
}

export async function updateSOAPNote(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}/soap/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating SOAP note:', error);
    throw error;
  }
}

export async function deleteSOAPNote(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/soap/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting SOAP note:', error);
    throw error;
  }
}

export async function getClinicalTasks() {
  try {
    const response = await axios.get(`${BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching clinical tasks:', error);
    throw error;
  }
}

export async function getClinicalTask(id) {
  try {
    const response = await axios.get(`${BASE_URL}/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching clinical task:', error);
    throw error;
  }
}

export async function createClinicalTask(data) {
  try {
    const response = await axios.post(`${BASE_URL}/tasks`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating clinical task:', error);
    throw error;
  }
}

export async function updateClinicalTask(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}/tasks/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating clinical task:', error);
    throw error;
  }
}

export async function deleteClinicalTask(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting clinical task:', error);
    throw error;
  }
}
