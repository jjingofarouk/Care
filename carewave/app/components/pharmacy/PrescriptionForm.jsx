'use client';
import React, { useState } from 'react';
import pharmacyService from '../../services/pharmacyService';

export default function PrescriptionForm({ patients, doctors, drugs }) {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    drugId: '',
    dosage: '',
    prescribedAt: new Date().toISOString().slice(0, 16),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await pharmacyService.createPrescription(formData);
      setFormData({
        patientId: '',
        doctorId: '',
        drugId: '',
        dosage: '',
        prescribedAt: new Date().toISOString().slice(0, 16),
      });
    } catch (error) {
      console.error('Error submitting prescription:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card w-full p-4">
      <div className="card-header">
        <h2 className="card-title">New Prescription</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <select
          className="select"
          value={formData.doctorId}
          onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.user.name}
            </option>
          ))}
        </select>
        <select
          className="select"
          value={formData.drugId}
          onChange={(e) => setFormData({ ...formData, drugId: e.target.value })}
          required
        >
          <option value="">Select Drug</option>
          {drugs.map((drug) => (
            <option key={drug.id} value={drug.id}>
              {drug.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="input"
          value={formData.dosage}
          onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
          placeholder="Dosage"
          required
        />
        <input
          type="datetime-local"
          className="input"
          value={formData.prescribedAt}
          onChange={(e) => setFormData({ ...formData, prescribedAt: e.target.value })}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary mt-4">
        Create Prescription
      </button>
    </form>
  );
}