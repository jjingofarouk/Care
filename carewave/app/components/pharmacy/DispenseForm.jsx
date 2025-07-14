'use client';
import React, { useState } from 'react';
import pharmacyService from '../../services/pharmacyService';

export default function DispenseForm({ patients, pharmacyItems }) {
  const [formData, setFormData] = useState({
    pharmacyItemId: '',
    patientId: '',
    quantity: '',
    dispensedAt: new Date().toISOString().slice(0, 16),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await pharmacyService.recordDispense(formData);
      setFormData({
        pharmacyItemId: '',
        patientId: '',
        quantity: '',
        dispensedAt: new Date().toISOString().slice(0, 16),
      });
    } catch (error) {
      console.error('Error submitting dispense record:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card w-full p-4">
      <div className="card-header">
        <h2 className="card-title">Dispense Medication</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          className="select"
          value={formData.pharmacyItemId}
          onChange={(e) => setFormData({ ...formData, pharmacyItemId: e.target.value })}
          required
        >
          <option value="">Select Pharmacy Item</option>
          {pharmacyItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.drug.name} (Batch: {item.batchNumber}, Qty: {item.quantity})
            </option>
          ))}
        </select>
        <select
          className="select"
          value={formData.patientId}
          onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
          required
        >
          <option value="">Select Patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.user.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          className="input"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          placeholder="Quantity"
          required
          min="1"
        />
        <input
          type="datetime-local"
          className="input"
          value={formData.dispensedAt}
          onChange={(e) => setFormData({ ...formData, dispensedAt: e.target.value })}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary mt-4">
        Record Dispense
      </button>
    </form>
  );
}