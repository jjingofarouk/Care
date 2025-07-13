import axios from 'axios';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const API_ROUTES = {
  MEDICAL_RECORDS: '/api/medical-records',
  STATS: '/api/medical-records/stats',
  RECENT: '/api/medical-records/recent',
  BULK: '/api/medical-records/bulk'
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
  (response) => response,
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
function validateMedicalRecordData(data) {
  if (!data) throw new Error('No medical record data provided');
  if (!data.patientId || !data.recordDate) {
    throw new Error('Patient ID and record date are required');
  }
  const recordDate = new Date(data.recordDate);
  if (isNaN(recordDate.getTime())) {
    throw new Error('Invalid date format for record date');
  }
  return true;
}

function validateAllergyData(data) {
  if (!data.medicalRecordId || !data.name || !data.severity) {
    throw new Error('Medical record ID, name, and severity are required for allergy');
  }
  return true;
}

function validateDiagnosisData(data) {
  if (!data.medicalRecordId || !data.code || !data.description || !data.diagnosedAt) {
    throw new Error('Medical record ID, code, description, and diagnosed date are required for diagnosis');
  }
  if (isNaN(new Date(data.diagnosedAt).getTime())) {
    throw new Error('Invalid date format for diagnosedAt');
  }
  return true;
}

function validateVitalSignData(data) {
  if (!data.medicalRecordId || !data.recordedAt) {
    throw new Error('Medical record ID and recorded date are required for vital sign');
  }
  if (isNaN(new Date(data.recordedAt).getTime())) {
    throw new Error('Invalid date format for recordedAt');
  }
  return true;
}

function validateChiefComplaintData(data) {
  if (!data.medicalRecordId || !data.description || !data.duration) {
    throw new Error('Medical record ID, description, and duration are required for chief complaint');
  }
  return true;
}

function validatePresentIllnessData(data) {
  if (!data.medicalRecordId || !data.narrative) {
    throw new Error('Medical record ID and narrative are required for present illness');
  }
  return true;
}

function validatePastConditionData(data) {
  if (!data.medicalRecordId || !data.condition) {
    throw new Error('Medical record ID and condition are required for past condition');
  }
  if (data.diagnosisDate && isNaN(new Date(data.diagnosisDate).getTime())) {
    throw new Error('Invalid date format for diagnosisDate');
  }
  return true;
}

function validateSurgicalHistoryData(data) {
  if (!data.medicalRecordId || !data.procedure) {
    throw new Error('Medical record ID and procedure are required for surgical history');
  }
  if (data.datePerformed && isNaN(new Date(data.datePerformed).getTime())) {
    throw new Error('Invalid date format for datePerformed');
  }
  return true;
}

function validateFamilyHistoryData(data) {
  if (!data.medicalRecordId || !data.relative || !data.condition) {
    throw new Error('Medical record ID, relative, and condition are required for family history');
  }
  if (data.ageAtDiagnosis && isNaN(data.ageAtDiagnosis)) {
    throw new Error('Invalid ageAtDiagnosis format');
  }
  return true;
}

function validateMedicationHistoryData(data) {
  if (!data.medicalRecordId || !data.medicationName || !data.dosage || !data.frequency) {
    throw new Error('Medical record ID, medication name, dosage, and frequency are required for medication history');
  }
  if (data.startDate && isNaN(new Date(data.startDate).getTime())) {
    throw new Error('Invalid date format for startDate');
  }
  if (data.endDate && isNaN(new Date(data.endDate).getTime())) {
    throw new Error('Invalid date format for endDate');
  }
  return true;
}

function validateSocialHistoryData(data) {
  if (!data.medicalRecordId) {
    throw new Error('Medical record ID is required for social history');
  }
  return true;
}

function validateReviewOfSystemsData(data) {
  if (!data.medicalRecordId || !data.system || !data.findings) {
    throw new Error('Medical record ID, system, and findings are required for review of systems');
  }
  return true;
}

function validateImmunizationData(data) {
  if (!data.medicalRecordId || !data.vaccine || !data.dateGiven) {
    throw new Error('Medical record ID, vaccine, and date given are required for immunization');
  }
  if (isNaN(new Date(data.dateGiven).getTime())) {
    throw new Error('Invalid date format for dateGiven');
  }
  return true;
}

function validateTravelHistoryData(data) {
  if (!data.medicalRecordId || !data.countryVisited) {
    throw new Error('Medical record ID and country visited are required for travel history');
  }
  if (data.dateFrom && isNaN(new Date(data.dateFrom).getTime())) {
    throw new Error('Invalid date format for dateFrom');
  }
  if (data.dateTo && isNaN(new Date(data.dateTo).getTime())) {
    throw new Error('Invalid date format for dateTo');
  }
  return true;
}

// Medical record service functions
export async function getAllMedicalRecords(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.resource) params.append('resource', filters.resource);

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

export async function getMedicalRecordById(id, resource = '') {
  try {
    if (!id) throw new Error('Medical record ID is required');
    const params = resource ? `?resource=${resource}` : '';
    const response = await apiClient.get(`${API_ROUTES.MEDICAL_RECORDS}/${id}${params}`);
    if (!response.data) throw new Error('Medical record not found');
    return response.data;
  } catch (error) {
    console.error('Error fetching medical record:', error);
    throw error;
  }
}

export async function createMedicalRecord(data) {
  try {
    validateMedicalRecordData(data);
    const response = await apiClient.post(API_ROUTES.MEDICAL_RECORDS, {
      resource: 'medicalRecord',
      ...data
    });
    if (!response.data) throw new Error('Failed to create medical record: no response data');
    return response.data;
  } catch (error) {
    console.error('Error creating medical record:', error);
    throw error;
  }
}

export async function updateMedicalRecord(id, data) {
  try {
    if (!id) throw new Error('Medical record ID is required');
    validateMedicalRecordData(data);
    const response = await apiClient.put(`${API_ROUTES.MEDICAL_RECORDS}/${id}`, {
      resource: 'medicalRecord',
      ...data
    });
    if (!response.data) throw new Error('Failed to update medical record: no response data');
    return response.data;
  } catch (error) {
    console.error('Error updating medical record:', error);
    throw error;
  }
}

export async function deleteMedicalRecord(id) {
  try {
    if (!id) throw new Error('Medical record ID is required');
    const response = await apiClient.delete(`${API_ROUTES.MEDICAL_RECORDS}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting medical record:', error);
    throw error;
  }
}

// Resource-specific functions
const resourceTypes = [
  { name: 'allergy', validator: validateAllergyData },
  { name: 'diagnosis', validator: validateDiagnosisData },
  { name: 'vitalSign', validator: validateVitalSignData },
  { name: 'chiefComplaint', validator: validateChiefComplaintData },
  { name: 'presentIllness', validator: validatePresentIllnessData },
  { name: 'pastCondition', validator: validatePastConditionData },
  { name: 'surgicalHistory', validator: validateSurgicalHistoryData },
  { name: 'familyHistory', validator: validateFamilyHistoryData },
  { name: 'medicationHistory', validator: validateMedicationHistoryData },
  { name: 'socialHistory', validator: validateSocialHistoryData },
  { name: 'reviewOfSystems', validator: validateReviewOfSystemsData },
  { name: 'immunization', validator: validateImmunizationData },
  { name: 'travelHistory', validator: validateTravelHistoryData }
];

resourceTypes.forEach(({ name, validator }) => {
  // Get all resources for patient
  exports[`get${name.charAt(0).toUpperCase() + name.slice(1)}s`] = async (patientId) => {
    try {
      if (!patientId) throw new Error('Patient ID is required');
      const response = await apiClient.get(API_ROUTES.MEDICAL_RECORDS, {
        params: { patientId, resource: name + 's' }
      });
      if (!Array.isArray(response.data)) {
        throw new Error(`Invalid response format for ${name}s: expected array`);
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${name}s:`, error);
      throw error;
    }
  };

  // Get resource by ID
  exports[`get${name.charAt(0).toUpperCase() + name.slice(1)}ById`] = async (id) => {
    try {
      if (!id) throw new Error(`${name} ID is required`);
      const response = await apiClient.get(`${API_ROUTES.MEDICAL_RECORDS}/${id}?resource=${name}`);
      if (!response.data) throw new Error(`${name} not found`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${name}:`, error);
      throw error;
    }
  };

  // Create resource
  exports[`create${name.charAt(0).toUpperCase() + name.slice(1)}`] = async (data) => {
    try {
      validator(data);
      const response = await apiClient.post(API_ROUTES.MEDICAL_RECORDS, {
        resource: name,
        ...data
      });
      if (!response.data) throw new Error(`Failed to create ${name}: no response data`);
      return response.data;
    } catch (error) {
      console.error(`Error creating ${name}:`, error);
      throw error;
    }
  };

  // Update resource
  exports[`update${name.charAt(0).toUpperCase() + name.slice(1)}`] = async (id, data) => {
    try {
      if (!id) throw new Error(`${name} ID is required`);
      validator(data);
      const response = await apiClient.put(`${API_ROUTES.MEDICAL_RECORDS}/${id}`, {
        resource: name,
        ...data
      });
      if (!response.data) throw new Error(`Failed to update ${name}: no response data`);
      return response.data;
    } catch (error) {
      console.error(`Error updating ${name}:`, error);
      throw error;
    }
  };

  // Delete resource
  exports[`delete${name.charAt(0).toUpperCase() + name.slice(1)}`] = async (id) => {
    try {
      if (!id) throw new Error(`${name} ID is required`);
      const response = await apiClient.delete(`${API_ROUTES.MEDICAL_RECORDS}/${id}?resource=${name}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting ${name}:`, error);
      throw error;
    }
  };
});

export async function bulkCreateMedicalRecords(records) {
  try {
    if (!Array.isArray(records) || records.length === 0) {
      throw new Error('Records array is required');
    }
    records.forEach(validateMedicalRecordData);
    
    const response = await apiClient.post(API_ROUTES.BULK, records);
    if (!response.data) throw new Error('Failed to bulk create medical records');
    
    return response.data;
  } catch (error) {
    console.error('Error in bulk create medical records:', error);
    throw error;
  }
}

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
    console.error('Error in bulk delete medical records:', error);
    throw error;
  }
}

export async function getMedicalRecordStats(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    
    const response = await apiClient.get(`${API_ROUTES.STATS}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching medical record stats:', error);
    throw error;
  }
}

export async function getRecentMedicalRecords(limit = 10) {
  try {
    const params = new URLSearchParams({ limit: limit.toString() });
    const response = await apiClient.get(`${API_ROUTES.RECENT}?${params.toString()}`);
    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format: expected array');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching recent medical records:', error);
    throw error;
  }
}

// Export default service object
const medicalRecordsService = {
  getAllMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  bulkCreateMedicalRecords,
  bulkDeleteMedicalRecords,
  getMedicalRecordStats,
  getRecentMedicalRecords,
  ...resourceTypes.reduce((acc, { name }) => ({
    ...acc,
    [`get${name.charAt(0).toUpperCase() + name.slice(1)}s`]: exports[`get${name.charAt(0).toUpperCase() + name.slice(1)}s`],
    [`get${name.charAt(0).toUpperCase() + name.slice(1)}ById`]: exports[`get${name.charAt(0).toUpperCase() + name.slice(1)}ById`],
    [`create${name.charAt(0).toUpperCase() + name.slice(1)}`]: exports[`create${name.charAt(0).toUpperCase() + name.slice(1)}`],
    [`update${name.charAt(0).toUpperCase() + name.slice(1)}`]: exports[`update${name.charAt(0).toUpperCase() + name.slice(1)}`],
    [`delete${name.charAt(0).toUpperCase() + name.slice(1)}`]: exports[`delete${name.charAt(0).toUpperCase() + name.slice(1)}`],
  }), {})
};

export default medicalRecordsService;