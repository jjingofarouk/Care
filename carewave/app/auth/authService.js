// /lib/auth/authService.js
import { API_ROUTES, BASE_URL } from '../api';

// Token refresh mechanism
let refreshPromise = null;

export async function refreshAccessToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  refreshPromise = fetch(`${BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })
  .then(async (response) => {
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    const data = await response.json();
    
    // Update stored tokens
    localStorage.setItem('token', data.token);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Set up next refresh
    setupTokenRefresh();
    
    return data.token;
  })
  .catch((error) => {
    // If refresh fails, clear tokens and redirect to login
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    throw error;
  })
  .finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

// Enhanced fetch wrapper that handles token refresh
export async function authenticatedFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const makeRequest = (authToken) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${authToken}`,
      },
    });
  };

  let response = await makeRequest(token);
  
  // If token expired, try to refresh
  if (response.status === 401) {
    try {
      const newToken = await refreshAccessToken();
      response = await makeRequest(newToken);
    } catch (error) {
      // Refresh failed, redirect to login
      logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
      throw error;
    }
  }

  return response;
}

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
  
  // Store both tokens
  localStorage.setItem('token', data.token);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('user', JSON.stringify(data.user));
  
  // Set up automatic token refresh
  setupTokenRefresh();
  
  return data;
}

export async function register({ email, password, firstName, lastName, role }) {
  const response = await fetch(`${BASE_URL}${API_ROUTES.REGISTER}`, {
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

export async function logout() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  // Clear tokens from localStorage first
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Clear any existing refresh timers
  if (typeof window !== 'undefined' && window.tokenRefreshTimer) {
    clearTimeout(window.tokenRefreshTimer);
  }
  
  // Notify server to invalidate refresh token
  if (refreshToken) {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error('Error during server logout:', error);
    }
  }
}

// Logout from all devices
export async function logoutAllDevices() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (user.id) {
    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch (error) {
      console.error('Error during logout from all devices:', error);
    }
  }
  
  // Clear local storage
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Clear any existing refresh timers
  if (typeof window !== 'undefined' && window.tokenRefreshTimer) {
    clearTimeout(window.tokenRefreshTimer);
  }
}

// Set up automatic token refresh
export function setupTokenRefresh() {
  if (typeof window === 'undefined') return;
  
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;
    
    // Clear existing timer
    if (window.tokenRefreshTimer) {
      clearTimeout(window.tokenRefreshTimer);
    }
    
    // Refresh token 2 minutes before expiry
    const refreshTime = Math.max(0, timeUntilExpiry - (2 * 60 * 1000));
    
    if (refreshTime > 0) {
      window.tokenRefreshTimer = setTimeout(() => {
        refreshAccessToken().catch((error) => {
          console.warn('Automatic token refresh failed:', error);
          // Don't redirect here, let the next API call handle it
        });
      }, refreshTime);
    }
  } catch (error) {
    console.error('Error setting up token refresh:', error);
  }
}

// Initialize token refresh on page load
if (typeof window !== 'undefined') {
  // Set up refresh on page load
  setupTokenRefresh();
  
  // Set up refresh when page becomes visible (user returns to tab)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (token && refreshToken) {
        // Check if token is expired or will expire soon
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = payload.exp * 1000;
          const currentTime = Date.now();
          
          // If token expires in less than 5 minutes, refresh it
          if (expirationTime - currentTime < 5 * 60 * 1000) {
            refreshAccessToken().catch((error) => {
              console.warn('Token refresh on visibility change failed:', error);
            });
          }
        } catch (error) {
          console.error('Error checking token expiry:', error);
        }
      }
    }
  });
}