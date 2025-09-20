import { API_ROUTES, BASE_URL } from '../api';

export async function getClinicalSettings() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CLINICAL_SETTINGS}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch clinical settings');
  return response.json();
}

export async function createClinicalSetting(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CLINICAL_SETTINGS}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create clinical setting');
  return response.json();
}
