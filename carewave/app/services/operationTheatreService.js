import axios from 'axios';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_ROUTES = {
  SURGERIES: '/api/surgeries',
  THEATRES: '/api/theatres',
  SURGICAL_TEAMS: '/api/surgical-teams',
  PATIENTS: '/api/patients',
  DEPARTMENTS: '/api/departments',
  USERS: '/api/users',
};

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(data?.error || `Server error: ${status}`);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// Validation functions
function validateSurgeryData(data) {
  if (!data) {
    throw new Error('No surgery data provided');
  }
  if (!data.patientId || !data.theatreId || !data.surgicalTeamId) {
    throw new Error('Patient ID, theatre ID, and surgical team ID are required');
  }
  if (data.status && !['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(data.status)) {
    throw new Error('Invalid surgery status');
  }
  return true;
}

function validateTheatreData(data) {
  if (!data) {
    throw new Error('No theatre data provided');
  }
  if (!data.name || !data.departmentId) {
    throw new Error('Theatre name and department ID are required');
  }
  return true;
}

function validateSurgicalTeamData(data) {
  if (!data) {
    throw new Error('No surgical team data provided');
  }
  if (!data.name || !data.members || !Array.isArray(data.members) || data.members.length === 0) {
    throw new Error('Team name and at least one member are required');
  }
  for (const member of data.members) {
    if (!member.userId || !member.role) {
      throw new Error('Each team member must have a user ID and role');
    }
    if (!['SURGEON', 'ASSISTANT', 'ANESTHESIOLOGIST', 'SCRUB_NURSE', 'CIRCULATING_NURSE', 'TECHNICIAN'].includes(member.role)) {
      throw new Error(`Invalid role for member: ${member.role}`);
    }
  }
  return true;
}

// Service functions
export async function getSurgeries(searchQuery = '') {
  try {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    const response = await apiClient.get(`${API_ROUTES.SURGERIES}?${params.toString()}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format: expected array');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching surgeries:', error);
    throw error;
  }
}

export async function getSurgery(id) {
  try {
    if (!id) {
      throw new Error('Surgery ID is required');
    }
    const response = await apiClient.get(`${API_ROUTES.SURGERIES}/${id}`);
    if (!response.data) {
      throw new Error('Surgery not found');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching surgery:', error);
    throw error;
  }
}

export async function createSurgery(data) {
  try {
    validateSurgeryData(data);
    const response = await apiClient.post(API_ROUTES.SURGERIES, data);
    if (!response.data) {
      throw new Error('Failed to create surgery: no response data');
    }
    return response.data;
  } catch (error) {
    console.error('Error creating surgery:', error);
    throw error;
  }
}

export async function updateSurgery(id, data) {
  try {
    if (!id) {
      throw new Error('Surgery ID is required');
    }
    validateSurgeryData(data);
    const response = await apiClient.put(`${API_ROUTES.SURGERIES}/${id}`, data);
    if (!response.data) {
      throw new Error('Failed to update surgery: no response data');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating surgery:', error);
    throw error;
  }
}

export async function deleteSurgery(id) {
  try {
    if (!id) {
      throw new Error('Surgery ID is required');
    }
    const response = await apiClient.delete(`${API_ROUTES.SURGERIES}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting surgery:', error);
    throw error;
  }
}

export async function getTheatres(searchQuery = '') {
  try {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    const response = await apiClient.get(`${API_ROUTES.THEATRES}?${params.toString()}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format: expected array');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching theatres:', error);
    throw error;
  }
}

export async function createTheatre(data) {
  try {
    validateTheatreData(data);
    const response = await apiClient.post(API_ROUTES.THEATRES, data);
    if (!response.data) {
      throw new Error('Failed to create theatre: no response data');
    }
    return response.data;
  } catch (error) {
    console.error('Error creating theatre:', error);
    throw error;
  }
}

export async function getSurgicalTeams(searchQuery = '') {
  try {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    const response = await apiClient.get(`${API_ROUTES.SURGICAL_TEAMS}?${params.toString()}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format: expected array');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching surgical teams:', error);
    throw error;
  }
}

export async function createSurgicalTeam(data) {
  try {
    validateSurgicalTeamData(data);
    const response = await apiClient.post(API_ROUTES.SURGICAL_TEAMS, data);
    if (!response.data) {
      throw new Error('Failed to create surgical team: no response data');
    }
    return response.data;
  } catch (error) {
    console.error('Error creating surgical team:', error);
    throw error;
  }
}

export async function getPatients(searchQuery = '') {
  try {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    const response = await apiClient.get(`${API_ROUTES.PATIENTS}?${params.toString()}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format: expected array');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
}

export async function getDepartments(searchQuery = '') {
  try {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    const response = await apiClient.get(`${API_ROUTES.DEPARTMENTS}?${params.toString()}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format: expected array');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
}

export async function getUsers(searchQuery = '') {
  try {
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    const response = await apiClient.get(`${API_ROUTES.USERS}?${params.toString()}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format: expected array');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

const operationTheatreService = {
  getSurgeries,
  getSurgery,
  createSurgery,
  updateSurgery,
  deleteSurgery,
  getTheatres,
  createTheatre,
  getSurgicalTeams,
  createSurgicalTeam,
  getPatients,
  getDepartments,
  getUsers,
};

export default operationTheatreService;