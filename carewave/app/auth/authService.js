import { API_ROUTES, BASE_URL } from '../api';

export async function login({ email, password }) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.AUTH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
}

export async function register({ email, password, firstName, lastName, role }) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.AUTH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, firstName, lastName, role }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Registration failed');
  }

  return response.json();
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}