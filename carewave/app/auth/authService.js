import { API_ROUTES, BASE_URL } from '../api';

export async function login({ email, password }) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.AUTH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function register({ email, password, firstName, lastName, role }) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.REGISTER}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies
    body: JSON.stringify({ email, password, firstName, lastName, role }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Registration failed');
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function refreshToken() {
  const response = await fetch(`${BASE_URL}/api/refresh`, {
    method: 'POST',
    credentials: 'include', // Include refresh token cookie
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to refresh token');
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  // Optionally revoke refresh token on server
  await fetch(`${BASE_URL}/api/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}