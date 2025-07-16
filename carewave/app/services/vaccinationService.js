// app/services/vaccinationService.js
export const vaccinationService = {
  async getVaccinations() {
    const response = await fetch('/api/vaccination');
    if (!response.ok) throw new Error('Failed to fetch vaccinations');
    return response.json();
  },

  async getVaccination(id) {
    const response = await fetch(`/api/vaccination/${id}`);
    if (!response.ok) throw new Error('Failed to fetch vaccination');
    return response.json();
  },

  async createVaccination(data) {
    const response = await fetch('/api/vaccination', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create vaccination');
    return response.json();
  },

  async updateVaccination(id, data) {
    const response = await fetch(`/api/vaccination/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update vaccination');
    return response.json();
  },

  async deleteVaccination(id) {
    const response = await fetch(`/api/vaccination/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete vaccination');
    return response.json();
  },

  async getVaccines() {
    const response = await fetch('/api/vaccination/vaccines');
    if (!response.ok) throw new Error('Failed to fetch vaccines');
    return response.json();
  },

  async getSchedules() {
    const response = await fetch('/api/vaccination/schedules');
    if (!response.ok) throw new Error('Failed to fetch schedules');
    return response.json();
  },
};
