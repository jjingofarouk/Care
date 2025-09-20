import { API_ROUTES, BASE_URL } from '../api';

class AuthService {
  async login({ email, password, rememberMe = false }) {
    const res = await fetch(`${BASE_URL}${API_ROUTES.AUTH}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
    const data = await res.json();
    this.setAuth(data.token, data.user, rememberMe);
    return data;
  }

  async register(userData) {
    const res = await fetch(`${BASE_URL}${API_ROUTES.AUTH}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Registration failed');
    }
    return res.json();
  }

  setAuth(token, user, persist = false) {
    if (persist) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', JSON.stringify(user));
    }
  }

  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  getUser() {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  logout() {
    localStorage.clear();
    sessionStorage.clear();
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;
   
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }
}

export default new AuthService();