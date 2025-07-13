// services/medicalRecordsService.js
import axios from 'axios';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_ROUTES = {
  MEDICAL_RECORDS: '/api/medical-records',
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

// Utility function to validate medical record data
function validateMedicalRecordData(data) {
  if (!data) {
    throw new Error('No medical record data provided');
  }
  
  if (!data.patientId || !data.recordDate) {
    throw new Error('Patient ID and record date are required');
  }
  
  // Validate date format
  const recordDate = new Date(data.recordDate);
  if (isNaN(recordDate.getTime())) {
    throw new Error('Invalid date format for record date');
  }
  
  return true;
}

// Medical Records service functions
export async function getMedicalRecords(filters = {}) {
  try {
    const params = new URLSearchParams();
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.patientId) {
      params.append('patientId', filters.patientId);
    }
    if (filters.dateFrom) {
      params.append('dateFrom', filters.dateFrom);
    }
    if (filters.dateTo) {
      params.append('dateTo', filters.dateTo);
    }
    if (filters.include) {
      params.append('include', filters.include);
    }
    
    const response = await apiClient.get(`${API_ROUTES.MEDICAL_RECORDS}?${params.toString()}`);
    
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format: expected array');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching medical records:', error);
    throw error;
  }
}

export async function getMedicalRecord(id, includeRelations = false) {
  try {
    if (!id) {
      throw new Error('Medical record ID is required');
    }
    
    const params = new URLSearchParams();
    if (includeRelations) {
      params.append('include', 'chiefComplaints,diagnoses,allergies,vitalSigns');
    }
    
    const url = `${API_ROUTES.MEDICAL_RECORDS}/${id}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await apiClient.get(url);
    
    if (!response.data) {
      throw new Error('Medical record not found');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching medical record:', error);
    throw error;
  }
}

export async function createMedicalRecord(data) {
  try {
    validateMedicalRecordData(data);
    
    const response = await apiClient.post(API_ROUTES.MEDICAL_RECORDS, data);
    
    if (!response.data) {
      throw new Error('Failed to create medical record: no response data');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating medical record:', error);
    throw error;
  }
}

export async function updateMedicalRecord(id, data) {
  try {
    if (!id) {
      throw new Error('Medical record ID is required');
    }
    
    validateMedicalRecordData(data);
    
    const response = await apiClient.put(`${API_ROUTES.MEDICAL_RECORDS}/${id}`, data);
    
    if (!response.data) {
      throw new Error('Failed to update medical record: no response data');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating medical record:', error);
    throw error;
  }
}

export async function deleteMedicalRecord(id) {
  try {
    if (!id) {
      throw new Error('Medical record ID is required');
    }
    
    const response = await apiClient.delete(`${API_ROUTES.MEDICAL_RECORDS}/${id}`);
    
    return response.data;
  } catch (error) {
    console.error('Error deleting medical record:', error);
    throw error;
  }
}

// Bulk operations
export async function bulkDeleteMedicalRecords(ids) {
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error('Medical record IDs array is required');
    }
    
    const deletePromises = ids.map(id => deleteMedicalRecord(id));
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

// Stats and analytics
export async function getMedicalRecordStats(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.patientId) {
      params.append('patientId', filters.patientId);
    }
    if (filters.dateFrom) {
      params.append('dateFrom', filters.dateFrom);
    }
    if (filters.dateTo) {
      params.append('dateTo', filters.dateTo);
    }
    
    const response = await apiClient.get(`${API_ROUTES.MEDICAL_RECORDS}/stats?${params.toString()}`);
    
    return response.data;
  } catch (error) {
    console.error('Error fetching medical record stats:', error);
    throw error;
  }
}

export async function getRecentMedicalRecords(limit = 10) {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    
    const response = await apiClient.get(`${API_ROUTES.MEDICAL_RECORDS}/recent?${params.toString()}`);
    
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format: expected array');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching recent medical records:', error);
    throw error;
  }
}

// Resource-specific functions (for future use)
export async function getMedicalRecordResource(recordId, resourceType) {
  try {
    if (!recordId || !resourceType) {
      throw new Error('Record ID and resource type are required');
    }
    
    const response = await apiClient.get(`${API_ROUTES.MEDICAL_RECORDS}/${recordId}/${resourceType}`);
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${resourceType} for record ${recordId}:`, error);
    throw error;
  }
}

export async function createMedicalRecordResource(recordId, resourceType, data) {
  try {
    if (!recordId || !resourceType || !data) {
      throw new Error('Record ID, resource type, and data are required');
    }
    
    const response = await apiClient.post(`${API_ROUTES.MEDICAL_RECORDS}/${recordId}/${resourceType}`, data);
    
    return response.data;
  } catch (error) {
    console.error(`Error creating ${resourceType} for record ${recordId}:`, error);
    throw error;
  }
}

export async function updateMedicalRecordResource(recordId, resourceType, resourceId, data) {
  try {
    if (!recordId || !resourceType || !resourceId || !data) {
      throw new Error('Record ID, resource type, resource ID, and data are required');
    }
    
    const response = await apiClient.put(`${API_ROUTES.MEDICAL_RECORDS}/${recordId}/${resourceType}/${resourceId}`, data);
    
    return response.data;
  } catch (error) {
    console.error(`Error updating ${resourceType} ${resourceId} for record ${recordId}:`, error);
    throw error;
  }
}

export async function deleteMedicalRecordResource(recordId, resourceType, resourceId) {
  try {
    if (!recordId || !resourceType || !resourceId) {
      throw new Error('Record ID, resource type, and resource ID are required');
    }
    
    const response = await apiClient.delete(`${API_ROUTES.MEDICAL_RECORDS}/${recordId}/${resourceType}/${resourceId}`);
    
    return response.data;
  } catch (error) {
    console.error(`Error deleting ${resourceType} ${resourceId} for record ${recordId}:`, error);
    throw error;
  }
}

// Export default service object
const medicalRecordsService = {
  getMedicalRecords,
  getMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  bulkDeleteMedicalRecords,
  getMedicalRecordStats,
  getRecentMedicalRecords,
  getMedicalRecordResource,
  createMedicalRecordResource,
  updateMedicalRecordResource,
  deleteMedicalRecordResource,
};

export default medicalRecordsService;