import axios from 'axios';

const BASE_URL = '/api/doctors';

export async function getDoctors(departmentId) {
  try {
    const url = departmentId ? `${BASE_URL}?departmentId=${departmentId}` : BASE_URL;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
}

export async function getDoctor(id) {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor:', error);
    throw error;
  }
}

export async function createDoctor(data) {
  try {
    const response = await axios.post(BASE_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
}

export async function updateDoctor(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
}

export async function deleteDoctor(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw error;
  }
}

export async function getSchedules(doctorId) {
  try {
    const url = doctorId ? `${BASE_URL}/schedules?doctorId=${doctorId}` : `${BASE_URL}/schedules`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
}

export async function getSchedule(id) {
  try {
    const response = await axios.get(`${BASE_URL}/schedules/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
}

export async function createSchedule(data) {
  try {
    const response = await axios.post(`${BASE_URL}/schedules`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
}

export async function updateSchedule(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}/schedules/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
}

export async function deleteSchedule(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/schedules/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
}

export async function getLeaves(doctorId) {
  try {
    const url = doctorId ? `${BASE_URL}/leaves?doctorId=${doctorId}` : `${BASE_URL}/leaves`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching leaves:', error);
    throw error;
  }
}

export async function getLeave(id) {
  try {
    const response = await axios.get(`${BASE_URL}/leaves/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leave:', error);
    throw error;
  }
}

export async function createLeave(data) {
  try {
    const response = await axios.post(`${BASE_URL}/leaves`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating leave:', error);
    throw error;
  }
}

export async function updateLeave(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}/leaves/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating leave:', error);
    throw error;
  }
}

export async function deleteLeave(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/leaves/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting leave:', error);
    throw error;
  }
}

export async function getSpecializations() {
  try {
    const response = await axios.get(`${BASE_URL}/specializations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching specializations:', error);
    throw error;
  }
}

export async function getSpecialization(id) {
  try {
    const response = await axios.get(`${BASE_URL}/specializations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching specialization:', error);
    throw error;
  }
}

export async function createSpecialization(data) {
  try {
    const response = await axios.post(`${BASE_URL}/specializations`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating specialization:', error);
    throw error;
  }
}

export async function updateSpecialization(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}/specializations/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating specialization:', error);
    throw error;
  }
}

export async function deleteSpecialization(id) {
  try {
    const response = await axios.delete(`${BASE_URL}/specializations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting specialization:', error);
    throw error;
  }
}