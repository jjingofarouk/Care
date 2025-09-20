import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getTransactions() {
  try {
    const response = await axios.get(`${API_URL}/api/accounting`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    throw error;
  }
}

export async function createTransaction(data) {
  try {
    console.log('Sending transaction data:', data);
    const response = await axios.post(`${API_URL}/api/accounting`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error.message, error.response?.data);
    throw error;
  }
}

export async function getPayrolls() {
  try {
    const response = await axios.get(`${API_URL}/api/accounting?type=payroll`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payrolls:', error.message);
    throw error;
  }
}

export async function createPayroll(data) {
  try {
    const response = await axios.post(`${API_URL}/api/accounting?type=payroll`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating payroll:', error.message, error.response?.data);
    throw error;
  }
}

export async function getAssets() {
  try {
    const response = await axios.get(`${API_URL}/api/accounting?type=asset`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assets:', error.message);
    throw error;
  }
}

export async function createAsset(data) {
  try {
    const response = await axios.post(`${API_URL}/api/accounting?type=asset`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating asset:', error.message, error.response?.data);
    throw error;
  }
}