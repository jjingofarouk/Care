import { API_ROUTES, BASE_URL } from '../api';

export async function getClaims() {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CLAIM_MGMT}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch claims');
  return response.json();
}

export async function createClaim(data) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.CLAIM_MGMT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create claim');
  return response.json();
}
