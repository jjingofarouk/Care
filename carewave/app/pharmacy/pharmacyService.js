import axios from 'axios';
import api from '../api';

const { BASE_URL, API_ROUTES } = api;

export async function getUsers() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.USERS}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch users');
  }
}

export async function getPharmacists() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=pharmacists`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.pharmacists;
  } catch (error) {
    console.error('Error fetching pharmacists:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch pharmacists');
  }
}

export async function addPharmacist(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'addPharmacist',
      payload: {
        name: data.name,
        email: data.email,
        password: data.password,
        licenseNumber: data.licenseNumber,
        phone: data.phone,
        specialty: data.specialty,
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding pharmacist:', error);
    throw new Error(error.response?.data?.error || 'Failed to add pharmacist');
  }
}

export async function updatePharmacist(id, data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`, {
      action: 'updatePharmacist',
      payload: {
        name: data.name,
        email: data.email,
        licenseNumber: data.licenseNumber,
        phone: data.phone,
        specialty: data.specialty,
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating pharmacist:', error);
    throw new Error(error.response?.data?.error || 'Failed to update pharmacist');
  }
}

export async function deletePharmacist(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}?resource=pharmacist`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting pharmacist:', error);
    throw new Error(error.response?.data?.error || 'Failed to delete pharmacist');
  }
}

export async function getPrescriptions() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=prescriptions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.prescriptions;
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch prescriptions');
  }
}

export async function createPrescription(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'createPrescription',
      payload: {
        patientId: parseInt(data.patientId),
        doctorId: parseInt(data.doctorId),
        notes: data.notes,
        items: data.items.map(item => ({
          medicationId: parseInt(item.medicationId),
          quantity: parseInt(item.quantity),
          dosage: item.dosage,
          frequency: item.frequency || 'As needed',
          duration: item.duration || 'Until finished',
        })),
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw new Error(error.response?.data?.error || 'Failed to create prescription');
  }
}

export async function updatePrescriptionStatus(id, status) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`, {
      action: 'updatePrescriptionStatus',
      payload: { status },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating prescription status:', error);
    throw new Error(error.response?.data?.error || 'Failed to update prescription status');
  }
}

export async function dispenseMedication(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'dispenseMedication',
      payload: {
        prescriptionId: parseInt(data.prescriptionId),
        medicationId: parseInt(data.medicationId),
        quantity: parseInt(data.quantity),
        patientType: data.patientType,
        dispensedById: parseInt(data.dispensedById),
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error dispensing medication:', error);
    throw new Error(error.response?.data?.error || 'Failed to dispense medication');
  }
}

export async function getInventory() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.inventory;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch inventory');
  }
}

export async function addMedication(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'addMedication',
      payload: {
        name: data.name,
        genericName: data.genericName || null,
        category: data.category,
        batchNumber: data.batchNumber,
        barcode: data.barcode || null,
        rfid: data.rfid || null,
        stockQuantity: parseInt(data.stockQuantity),
        minStockThreshold: parseInt(data.minStockThreshold) || 10,
        price: parseFloat(data.price),
        expiryDate: data.expiryDate,
        supplierId: data.supplierId ? parseInt(data.supplierId) : null,
        formularyId: data.formularyId ? parseInt(data.formularyId) : null,
        narcotic: data.narcotic || false,
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw new Error(error.response?.data?.error || 'Failed to add medication');
  }
}

export async function updateMedication(id, data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`, {
      action: 'updateMedication',
      payload: {
        name: data.name,
        genericName: data.genericName || null,
        category: data.category,
        batchNumber: data.batchNumber,
        barcode: data.barcode || null,
        rfid: data.rfid || null,
        stockQuantity: parseInt(data.stockQuantity),
        minStockThreshold: parseInt(data.minStockThreshold) || 10,
        price: parseFloat(data.price),
        expiryDate: data.expiryDate,
        supplierId: data.supplierId ? parseInt(data.supplierId) : null,
        formularyId: data.formularyId ? parseInt(data.formularyId) : null,
        narcotic: data.narcotic || false,
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating medication:', error);
    throw new Error(error.response?.data?.error || 'Failed to update medication');
  }
}

export async function updateStock(id, stockQuantity, reason, adjustedById) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`, {
      action: 'updateStock',
      payload: {
        stockQuantity: parseInt(stockQuantity),
        reason: reason || 'Manual adjustment',
        adjustedById: parseInt(adjustedById),
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw new Error(error.response?.data?.error || 'Failed to update stock');
  }
}

export async function deleteMedication(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}?resource=medication`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw new Error(error.response?.data?.error || 'Failed to delete medication');
  }
}






export async function getFormularies() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=formularies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Ensure medications is always an array
    return response.data.formularies.map(formulary => ({
      ...formulary,
      medications: Array.isArray(formulary.medications) ? formulary.medications : [],
    }));
  } catch (error) {
    console.error('Error fetching formularies:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch formularies');
  }
}

export async function addFormulary(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'addFormulary',
      payload: {
        name: data.name,
        description: data.description || null,
        medicationIds: data.medicationIds || [], // Include medication IDs
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Ensure medications is an array in the response
    return {
      ...response.data,
      medications: Array.isArray(response.data.medications) ? response.data.medications : [],
    };
  } catch (error) {
    console.error('Error adding formulary:', error);
    throw new Error(error.response?.data?.error || 'Failed to add formulary');
  }
}

export async function getMedications() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.inventory;
  } catch (error) {
    console.error('Error fetching medications:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch medications');
  }
}

export async function getSuppliers() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=suppliers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.suppliers;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch suppliers');
  }
}

export async function addSupplier(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'addSupplier',
      payload: {
        name: data.name,
        contact: data.contact,
        email: data.email,
        address: data.address,
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding supplier:', error);
    throw new Error(error.response?.data?.error || 'Failed to add supplier');
  }
}

export async function updateSupplier(id, data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`, {
      action: 'updateSupplier',
      payload: {
        name: data.name,
        contact: data.contact,
        email: data.email,
        address: data.address,
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw new Error(error.response?.data?.error || 'Failed to update supplier');
  }
}

export async function deleteSupplier(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}?resource=supplier`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw new Error(error.response?.data?.error || 'Failed to delete supplier');
  }
}

export async function createInvoice(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'createInvoice',
      payload: {
        prescriptionId: parseInt(data.prescriptionId),
        totalAmount: parseFloat(data.totalAmount),
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw new Error(error.response?.data?.error || 'Failed to create invoice');
  }
}

export async function processRefund(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'processRefund',
      payload: {
        invoiceId: parseInt(data.invoiceId),
        reason: data.reason,
        amount: parseFloat(data.amount),
        processedById: parseInt(data.processedById),
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw new Error(error.response?.data?.error || 'Failed to process refund');
  }
}

export async function getStockAlerts() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=stockAlerts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.stockAlerts;
  } catch (error) {
    console.error('Error fetching stock alerts:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch stock alerts');
  }
}

export async function getOrders() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch orders');
  }
}

export async function createOrder(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'createOrder',
      payload: {
        supplierId: parseInt(data.supplierId),
        items: data.items.map(item => ({
          medicationId: parseInt(item.medicationId),
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
        })),
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error(error.response?.data?.error || 'Failed to create order');
  }
}

export async function updateOrderStatus(id, status) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`, {
      action: 'updateOrderStatus',
      payload: { status },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error(error.response?.data?.error || 'Failed to update order status');
  }
}

export async function scanBarcode(barcode) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=inventory&barcode=${barcode}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.inventory[0];
  } catch (error) {
    console.error('Error scanning barcode:', error);
    throw new Error(error.response?.data?.error || 'Failed to scan barcode');
  }
}

export async function generateStockReport() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.inventory;
  } catch (error) {
    console.error('Error generating stock report:', error);
    throw new Error(error.response?.data?.error || 'Failed to generate stock report');
  }
}

export async function generateSalesReport() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=prescriptions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.prescriptions.flatMap(p => p.dispensingRecords);
  } catch (error) {
    console.error('Error generating sales report:', error);
    throw new Error(error.response?.data?.error || 'Failed to generate sales report');
  }
}

export async function checkDrugInteractions(medicationIds) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=drugInteractions&medicationIds=${medicationIds.join(',')}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.interactions;
  } catch (error) {
    console.error('Error checking drug interactions:', error);
    throw new Error(error.response?.data?.error || 'Failed to check drug interactions');
  }
}

export async function getDoctors() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.DOCTOR}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
}

export async function updateDoctor(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.DOCTOR}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating doctor:', error);
    throw error;
  }
}

export async function deleteDoctor(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.DOCTOR}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting doctor:', error);
    throw error;
  }
}

