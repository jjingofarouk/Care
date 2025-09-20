import { API_ROUTES, BASE_URL } from '../api';

export async function getDashboardData() {
  try {
    const response = await fetch(`${BASE_URL}${API_ROUTES.DASHBOARD}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}