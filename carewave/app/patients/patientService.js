// services/patientService.js
import axios from 'axios';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_ROUTES = {
  PATIENTS: '/api/patients',
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
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      throw new Error(data?.error || `Server error: ${status}`);
    } else if (error.request) {
      // Request was made but no response
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// Utility function to validate patient data
function validatePatientData(data) {
  if (!data) {
    throw new Error('No patient data provided');
  }
  
  if (!data.firstName || !data.lastName || !data.dateOfBirth) {
    throw new Error('First name, last name, and date of birth are required');
  }
  
  // Validate date format
  const dateOfBirth = new Date(data.dateOfBirth);
  if (isNaN(dateOfBirth.getTime())) {
    throw new Error('Invalid date format for date of birth');
  }
  
  // Validate email format if provided
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('Invalid email format');
  }
  
  return true;
}

// Patient service functions
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

export async function getPatient(id, includeRelations = false) {
  try {
    if (!id) {
      throw new Error('Patient ID is required');
    }
    
    const params = new URLSearchParams();
    if (includeRelations) {
      params.append('include', 'addresses,nextOfKin,insuranceInfo');
    }
    
    const url = `${API_ROUTES.PATIENTS}/${id}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url);
    
    if (!response.data) {
      throw new Error('Patient not found');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
}

export async function createPatient(data) {
  try {
    validatePatientData(data);
    
    const response = await apiClient.post(API_ROUTES.PATIENTS, data);
    
    if (!response.data) {
      throw new Error('Failed to create patient: no response data');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
}

export async function updatePatient(id, data) {
  try {
    if (!id) {
      throw new Error('Patient ID is required');
    }
    
    validatePatientData(data);
    
    const response = await apiClient.put(`${API_ROUTES.PATIENTS}/${id}`, data);
    
    if (!response.data) {
      throw new Error('Failed to update patient: no response data');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
}

export async function deletePatient(id) {
  try {
    if (!id) {
      throw new Error('Patient ID is required');
    }
    
    const response = await apiClient.delete(`${API_ROUTES.PATIENTS}/${id}`);
    
    return response.data;
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
}

// Bulk operations
export async function bulkDeletePatients(ids) {
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('Patient IDs array is required');
    }
    
    const deletePromises = ids.map(id => deletePatient(id));
    const results = await Promise.allSettled(deletePromises);
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    
    return {
      successful,
      failed,
      total: ids.length,
      errors: results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason.message)
    };
  } catch (error) {
    console.error('Error in bulk delete:', error);
    throw error;
  }
}

// Export default service object
const patientService = {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  bulkDeletePatients,
};

export default patientService;