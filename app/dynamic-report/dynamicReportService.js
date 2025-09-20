import { API_ROUTES, BASE_URL } from '../api';

export async function getDynamicReports() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DYNAMIC_REPORT}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch dynamic reports');
  return response.json();
}

export async function createDynamicReport(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.DYNAMIC_REPORT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create dynamic report');
  return response.json();
}
