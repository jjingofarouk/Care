'use client';
import React, { useState, useEffect } from 'react';
import pharmacyService from '../../services/pharmacyService';
import { Search } from 'lucide-react';

export default function PrescriptionForm({ patients, doctors, drugs }) {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    drugId: '',
    dosage: '',
    prescribedAt: new Date().toISOString().slice(0, 16),
  });
  const [searchTerms, setSearchTerms] = useState({
    patient: '',
    doctor: '',
    drug: '',
  });
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const [filteredDrugs, setFilteredDrugs] = useState(drugs);

  useEffect(() => {
    setFilteredPatients(
      patients.filter((patient) =>
        patient.user.name.toLowerCase().includes(searchTerms.patient.toLowerCase())
      )
    );
    setFilteredDoctors(
      doctors.filter((doctor) =>
        doctor.user.name.toLowerCase().includes(searchTerms.doctor.toLowerCase())
      )
    );
    setFilteredDrugs(
      drugs.filter((drug) =>
        drug.name.toLowerCase().includes(searchTerms.drug.toLowerCase())
      )
    );
  }, [searchTerms, patients, doctors, drugs]);

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
      setSearchTerms({ patient: '', doctor: '', drug: '' });
    } catch (error) {
      console.error('Error submitting prescription:', error);
    }
  };

  const handleSearchChange = (field, value) => {
    setSearchTerms({ ...searchTerms, [field]: value });
  };

  return (
    <form onSubmit={handleSubmit} className="card w-full p-4">
      <div className="card-header">
        <h2 className="card-title">New Prescription</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            className="input pl-10"
            value={searchTerms.patient}
            onChange={(e) => handleSearchChange('patient', e.target.value)}
            placeholder="Search Patients"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--hospital-gray-500)]" />
          <select
            className="select mt-2"
            value={formData.patientId}
            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
            required
          >
            <option value="">Select Patient</option>
            {filteredPatients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <input
            type="text"
            className="input pl-10"
            value={searchTerms.doctor}
            onChange={(e) => handleSearchChange('doctor', e.target.value)}
            placeholder="Search Doctors"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--hospital-gray-500)]" />
          <select
            className="select mt-2"
            value={formData.doctorId}
            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
            required
          >
            <option value="">Select Doctor</option>
            {filteredDoctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <input
            type="text"
            className="input pl-10"
            value={searchTerms.drug}
            onChange={(e) => handleSearchChange('drug', e.target.value)}
            placeholder="Search Drugs"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--hospital-gray-500)]" />
          <select
            className="select mt-2"
            value={formData.drugId}
            onChange={(e) => setFormData({ ...formData, drugId: e.target.value })}
            required
          >
            <option value="">Select Drug</option>
            {filteredDrugs.map((drug) => (
              <option key={drug.id} value={drug.id}>
                {drug.name}
              </option>
            ))}
          </select>
        </div>
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