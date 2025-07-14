// app/services/adtService.js
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = '/api/adt';

export async function getAdmissions(filters = {}) {
  try {
    const response = await axios.get(`${API_URL}/admissions`, {
      params: filters,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admissions:', error);
    throw error.response?.data || error;
  }
}

export async function createAdmission(data) {
  try {
    const response = await axios.post(`${API_URL}/admissions`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating admission:', error);
    throw error.response?.data || error;
  }
}

export async function updateAdmission(id, data) {
  try {
    const response = await axios.patch(`${API_URL}/admissions/${id}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating admission:', error);
    throw error.response?.data || error;
  }
}

export async function dischargePatient(admissionId, data) {
  try {
    const response = await axios.post(`${API_URL}/discharges`, { admissionId, ...data }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error discharging patient:', error);
    throw error.response?.data || error;
  }
}

export async function getDischarges(filters = {}) {
  try {
    const response = await axios.get(`${API_URL}/discharges`, {
      params: filters,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching discharges:', error);
    throw error.response?.data || error;
  }
}

export async function transferPatient(admissionId, data) {
  try {
    const response = await axios.post(`${API_URL}/transfers`, { admissionId, ...data }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error transferring patient:', error);
    throw error.response?.data || error;
  }
}

export async function getTransfers(filters = {}) {
  try {
    const response = await axios.get(`${API_URL}/transfers`, {
      params: filters,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching transfers:', error);
    throw error.response?.data || error;
  }
}

export async function updateBedStatus(bedId, isOccupied) {
  try {
    const response = await axios.patch(`${API_URL}/beds/${bedId}`, { isOccupied }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating bed status:', error);
    throw error.response?.data || error;
  }
}

export async function getAnalytics(filters = {}) {
  try {
    const response = await axios.get(`${API_URL}/analytics`, {
      params: filters,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error.response?.data || error;
  }
}

export async function getWards() {
  try {
    const wards = await prisma.ward.findMany({
      select: { id: true, name: true, department: { select: { name: true } } },
      orderBy: { name: 'asc' },
    });
    return wards.map(ward => ({
      ...ward,
      departmentName: ward.department.name,
    }));
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw error;
  }
}

export async function getBeds(filters = {}) {
  try {
    const beds = await prisma.bed.findMany({
      where: { ...(filters.wardId && { wardId: filters.wardId }) },
      select: { id: true, bedNumber: true, isOccupied: true, ward: { select: { name: true } } },
      orderBy: { bedNumber: 'asc' },
    });
    return beds.map(bed => ({
      ...bed,
      wardName: bed.ward.name,
    }));
  } catch (error) {
    console.error('Error fetching beds:', error);
    throw error;
  }
}

const adtService = {
  getAdmissions,
  createAdmission,
  updateAdmission,
  dischargePatient,
  getDischarges,
  transferPatient,
  getTransfers,
  updateBedStatus,
  getAnalytics,
  getWards,
  getBeds*.
};
export default adtService;