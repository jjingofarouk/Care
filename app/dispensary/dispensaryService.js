import { API_ROUTES, BASE_URL } from '../api';

export async function getDispensaryRecords() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DISPENSARY}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch dispensary records');
  return response.json();
}

export async function createDispensaryRecord(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DISPENSARY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create dispensary record');
  return response.json();
}
