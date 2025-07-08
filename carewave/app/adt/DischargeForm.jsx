"use client";
import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Grid, Paper, Typography, Box, Autocomplete } from '@mui/material';
import { createDischarge, updateDischarge, getPatients } from './adtService';

export default function DischargeForm({ discharge, onSubmit, doctors }) {
  const [formData, setFormData] = useState({
    patientId: discharge?.patientId || '',
    doctorId: discharge?.doctorId || '',
    dischargeDate: discharge?.dischargeDate ? new Date(discharge.dischargeDate).toISOString().split('T')[0] : '',
    dischargeNotes: discharge?.dischargeNotes || '',
    followUpInstructions: discharge?.followUpInstructions || '',
    medications: discharge?.medications || '',
  });
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchPatients() {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    }
    fetchPatients();
    if (discharge?.id) {
      setFormData({
        patientId: discharge.patientId,
        doctorId: discharge.doctorId,
        dischargeDate: discharge.dischargeDate ? new Date(discharge.dischargeDate).toISOString().split('T')[0] : '',
        dischargeNotes: discharge.dischargeNotes || '',
        followUpInstructions: discharge.followUpInstructions || '',
        medications: discharge.medications || '',
      });
    }
  }, [discharge]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePatientSelect = (event, value) => {
    setFormData({ ...formData, patientId: value ? value.id : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (discharge?.id) {
        await updateDischarge(discharge.id, formData);
      } else {
        await createDischarge(formData);
      }
      onSubmit();
      setFormData({
        patientId: '',
        doctorId: '',
        dischargeDate: '',
        dischargeNotes: '',
        followUpInstructions: '',
        medications: '',
      });
      setSearchQuery('');
    } catch (error) {
      console.error('Error submitting discharge:', error);
    }
  };

  return (
    <div className="p-6 bg-hospital-white dark:bg-hospital-gray-900">
      <div className="p-4 bg-hospital-gray-50 dark:bg-hospital-gray-800 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-hospital-gray-900 dark:text-hospital-white mb-4">
          {discharge?.id ? 'Update Discharge' : 'New Discharge'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Autocomplete
              options={patients}
              getOptionLabel={(option) => `${option.user.name} (${option.patientId})`}
              onChange={handlePatientSelect}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Patient"
                  fullWidth
                  required
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
                />
              )}
            />
            <TextField
              select
              label="Doctor"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              fullWidth
              required
              className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.user.name} ({doctor.specialty})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="date"
              label="Discharge Date"
              name="dischargeDate"
              value={formData.dischargeDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            />
            <TextField
              label="Discharge Notes"
              name="dischargeNotes"
              value={formData.dischargeNotes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              className="sm:col-span-2 bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            />
            <TextField
              label="Follow-up Instructions"
              name="followUpInstructions"
              value={formData.followUpInstructions}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              className="sm:col-span-2 bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            />
            <TextField
              label="Medications"
              name="medications"
              value={formData.medications}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              className="sm:col-span-2 bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            />
            <Button
              type="submit"
              variant="contained"
              className="sm:col-span-2 bg-hospital-accent text-hospital-white hover:bg-hospital-teal-light rounded-md px-4 py-2"
            >
              {discharge?.id ? 'Update Discharge' : 'Add Discharge'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}