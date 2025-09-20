import { API_ROUTES, BASE_URL } from '../api';

export async function getBills() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.BILLING}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch bills');
  return response.json();
}

export async function createBill(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.BILLING}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create bill');
  return response.json();
}
