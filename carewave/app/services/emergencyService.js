export const emergencyService = {
  async getEmergencies() {
    const response = await fetch('/api/emergency');
    return await response.json();
  },

  async getEmergency(id) {
    const response = await fetch(`/api/emergency/${id}`);
    return await response.json();
  },

  async createEmergency(data) {
    await fetch('/api/emergency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updateEmergency(id, data) {
    await fetch(`/api/emergency/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteEmergency(id) {
    await fetch(`/api/emergency/${id}`, {
      method: 'DELETE',
    });
  },

  async getAmbulances() {
    const response = await fetch('/api/emergency/ambulance');
    return await response.json();
  },

  async getAmbulance(id) {
    const response = await fetch(`/api/emergency/ambulance/${id}`);
    return await response.json();
  },

  async createAmbulance(data) {
    await fetch('/api/emergency/ambulance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updateAmbulance(id, data) {
    await fetch(`/api/emergency/ambulance/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteAmbulance(id) {
    await fetch(`/api/emergency/ambulance/${id}`, {
      method: 'DELETE',
    });
  },

  async getTriages() {
    const response = await fetch('/api/emergency/triage');
    return await response.json();
  },

  async getTriage(id) {
    const response = await fetch(`/api/emergency/triage/${id}`);
    return await response.json();
  },

  async createTriage(data) {
    await fetch('/api/emergency/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updateTriage(id, data) {
    await fetch(`/api/emergency/triage/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteTriage(id) {
    await fetch(`/api/emergency/triage/${id}`, {
      method: 'DELETE',
    });
  },

  async getEmergencyLogs() {
    const response = await fetch('/api/emergency/emergency-log');
    return await response.json();
  },

  async getEmergencyLog(id) {
    const response = await fetch(`/api/emergency/emergency-log/${id}`);
    return await response.json();
  },

  async createEmergencyLog(data) {
    await fetch('/api/emergency/emergency-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async updateEmergencyLog(id, data) {
    await fetch(`/api/emergency/emergency-log/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  },

  async deleteEmergencyLog(id) {
    await fetch(`/api/emergency/emergency-log/${id}`, {
      method: 'DELETE',
    });
  },
};