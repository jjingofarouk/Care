"use client";
import React, { useState } from 'react';
import { Box, TextField, Button, Grid, Typography, Alert } from '@mui/material';
import { createMedicalRecord } from './medicalRecordsService';

export default function MedicalHistoryForm({ patient, onSubmit }) {
  const [formData, setFormData] = useState({
    recordId: '',
    diagnosis: '',
    presentingComplaint: '',
    familyHistory: '',
    socialHistory: '',
    pastMedicalHistory: '',
    allergies: '',
    medications: '',
    date: new Date().toISOString().split('T')[0],
    doctorName: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMedicalRecord({
        ...formData,
        patientId: patient.id,
      });
      onSubmit();
      setFormData({
        recordId: '',
        diagnosis: '',
        presentingComplaint: '',
        familyHistory: '',
        socialHistory: '',
        pastMedicalHistory: '',
        allergies: '',
        medications: '',
        date: new Date().toISOString().split('T')[0],
        doctorName: '',
      });
      setError(null);
    } catch (error) {
      console.error('Error creating medical record:', error);
      setError(error.response?.data?.details || error.message);
    }
  };

  return (
    <div className="bg-hospital-white dark:bg-hospital-gray-900 p-6 rounded-lg shadow-md">
      <Typography variant="h6" className="text-hospital-gray-900 dark:text-hospital-white mb-4 font-semibold">
        Add Medical History for {patient?.name}
      </Typography>
      {error && (
        <Alert severity="error" className="mb-4 bg-hospital-error/10 text-hospital-error border border-hospital-error/20 rounded-md">
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Record ID"
            name="recordId"
            value={formData.recordId}
            onChange={handleChange}
            fullWidth
            required
            className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          />
          <TextField
            type="date"
            label="Date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
            className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          />
          <TextField
            label="Doctor Name"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            fullWidth
            required
            className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md col-span-1 sm:col-span-2"
          />
          <TextField
            label="Diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            required
            className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md col-span-1 sm:col-span-2"
          />
          <TextField
            label="Presenting Complaint"
            name="presentingComplaint"
            value={formData.presentingComplaint}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md col-span-1 sm:col-span-2"
          />
          <TextField
            label="Family History"
            name="familyHistory"
            value={formData.familyHistory}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md col-span-1 sm:col-span-2"
          />
          <TextField
            label="Social History"
            name="socialHistory"
            value={formData.socialHistory}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md col-span-1 sm:col-span-2"
          />
          <TextField
            label="Past Medical History"
            name="pastMedicalHistory"
            value={formData.pastMedicalHistory}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md col-span-1 sm:col-span-2"
          />
          <TextField
            label="Allergies"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md col-span-1 sm:col-span-2"
          />
          <TextField
            label="Medications"
            name="medications"
            value={formData.medications}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md col-span-1 sm:col-span-2"
          />
          <div className="col-span-1 sm:col-span-2">
            <Button
              type="submit"
              variant="contained"
              className="bg-hospital-accent text-hospital-white hover:bg-hospital-teal-light transition-transform duration-fast ease-in-out transform hover:-translate-y-1 rounded-md px-4 py-2"
            >
              Add Medical Record
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}