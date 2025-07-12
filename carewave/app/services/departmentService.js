import axios from 'axios';

const BASE_URL = '/api/departments';

export async function getDepartments() {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
}

export async function getDepartment(id) {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching department:', error);
    throw error;
  }
}

export async function createDepartment(data) {
  try {
    const response = await axios.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
}

export async function updateDepartment(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
}

export async function deleteDepartment(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
}

export async function getUnits(departmentId) {
  try {
    const url = departmentId ? `${BASE_URL}/units?departmentId=${departmentId}` : `${BASE_URL}/units`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching units:', error);
    throw error;
  }
}

export async function createUnit(data) {
  try {
    const response = await axios.post(`${BASE_URL}/units`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating unit:', error);
    throw error;
  }
}

export async function updateUnit(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}/units/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating unit:', error);
    throw error;
  }
}

export async function deleteUnit(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/units/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting unit:', error);
    throw error;
  }
}