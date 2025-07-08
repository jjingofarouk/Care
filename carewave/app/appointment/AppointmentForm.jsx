"use client";

import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';

export default function AppointmentForm({ patients, doctors, departments, onSuccess, appointment, userId }) {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    departmentId: '',
    date: '',
    type: 'REGULAR',
    reason: '',
    notes: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [fetchedPatients, setFetchedPatients] = useState([]);
  const [fetchedDoctors, setFetchedDoctors] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        const [patientsRes, doctorsRes] = await Promise.all([
          axios.get(`${api.BASE_URL}${api.API_ROUTES.PATIENT}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${api.BASE_URL}${api.API_ROUTES.DOCTOR}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setFetchedPatients(patientsRes.data);
        setFetchedDoctors(doctorsRes.data);
      } catch (err) {
        setError('Failed to fetch patients or doctors: ' + (err.response?.data?.error || err.message));
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (appointment) {
      const date = appointment.date ? new Date(appointment.date) : null;
      setFormData({
        patientId: appointment.patientId || '',
        doctorId: appointment.doctorId || '',
        departmentId: appointment.departmentId || '',
        date: date && !isNaN(date) ? date.toISOString().slice(0, 16) : '',
        type: appointment.type || 'REGULAR',
        reason: appointment.reason || '',
        notes: appointment.notes || '',
      });
    }
  }, [appointment]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.reason) {
      setError('All required fields must be filled.');
      return false;
    }
    const selectedDate = new Date(formData.date);
    if (isNaN(selectedDate) || selectedDate < new Date()) {
      setError('Please select a valid future date.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setOpenConfirm(true);
  };

  const confirmSubmission = async () => {
    setLoading(true);
    try {
      const data = {
        resource: 'appointment',
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        date: formData.date,
        type: formData.type,
        reason: formData.reason,
        notes: formData.notes,
        bookedById: userId,
      };
      const token = localStorage.getItem('token');
      if (appointment) {
        await axios.put(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}/${appointment.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSuccess();
      setFormData({ patientId: '', doctorId: '', departmentId: '', date: '', type: 'REGULAR', reason: '', notes: '' });
      setOpenConfirm(false);
    } catch (err) {
      setError('Failed to process appointment: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const reasons = ['Consultation', 'Follow-up', 'Emergency', 'Routine Checkup', 'Other'];

  return (
    <div className="p-6 bg-hospital-white dark:bg-hospital-gray-900">
      <form onSubmit={handleSubmit} className="bg-hospital-gray-50 dark:bg-hospital-gray-800 p-6 rounded-lg shadow-md max-w-lg mx-auto">
        <h2 className="text-lg font-semibold text-hospital-gray-900 dark:text-hospital-white mb-4">Create Appointment</h2>
        <SearchableSelect
          options={fetchedPatients.length > 0 ? fetchedPatients : patients}
          value={formData.patientId}
          onChange={(value) => setFormData({ ...formData, patientId: value })}
          getOptionLabel={(patient) => patient.user?.name || patient.patientId || 'Unknown'}
          getOptionValue={(patient) => patient.id}
          required
          className="mb-4 bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
        />
        <SearchableSelect
          options={fetchedDoctors.length > 0 ? fetchedDoctors : doctors}
          value={formData.doctorId}
          onChange={(value) => setFormData({ ...formData, doctorId: value })}
          getOptionLabel={(doctor) => `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})`}
          getOptionValue={(doctor) => doctor.id}
          required
          className="mb-4 bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
        />
        <FormControl fullWidth className="mb-4">
          <InputLabel className="text-hospital-gray-900 dark:text-hospital-white">Department</InputLabel>
          <Select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          >
            <MenuItem value="">Select Department</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          InputLabelProps={{ shrink: true }}
          className="mb-4 bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
        />
        <FormControl fullWidth className="mb-4">
          <InputLabel className="text-hospital-gray-900 dark:text-hospital-white">Type</InputLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          >
            <MenuItem value="REGULAR">Regular</MenuItem>
            <MenuItem value="WALK_IN">Walk-In</MenuItem>
            <MenuItem value="EMERGENCY">Emergency</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth className="mb-4">
          <InputLabel className="text-hospital-gray-900 dark:text-hospital-white">Reason</InputLabel>
          <Select
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          >
            <MenuItem value="">Select Reason</MenuItem>
            {reasons.map((reason) => (
              <MenuItem key={reason} value={reason}>{reason}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          multiline
          rows={4}
          className="mb-4 bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
        />
        {error && <p className="text-hospital-error mb-4">{error}</p>}
        <div className="flex gap-4 justify-center">
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            className="bg-hospital-accent text-hospital-white hover:bg-hospital-teal-light transition-transform duration-fast ease-in-out transform hover:-translate-y-1 rounded-md px-4 py-2"
          >
            {loading ? 'Processing...' : appointment ? 'Update Appointment' : 'Create Appointment'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setFormData({ patientId: '', doctorId: '', departmentId: '', date: '', type: 'REGULAR', reason: '', notes: '' })}
            className="border-hospital-gray-300 text-hospital-gray-900 dark:text-hospital-white hover:bg-hospital-gray-100 dark:hover:bg-hospital-gray-700 rounded-md px-4 py-2"
          >
            Clear
          </Button>
        </div>

        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} className="bg-hospital-white dark:bg-hospital-gray-900 rounded-lg">
          <DialogTitle className="text-hospital-gray-900 dark:text-hospital-white">Confirm Appointment</DialogTitle>
          <DialogContent className="text-hospital-gray-900 dark:text-hospital-white">
            <p><strong>Patient:</strong> {(fetchedPatients.length > 0 ? fetchedPatients : patients).find((p) => p.id === parseInt(formData.patientId))?.user?.name || 'Unknown'}</p>
            <p><strong>Doctor:</strong> {(fetchedDoctors.length > 0 ? fetchedDoctors : doctors).find((d) => d.id === parseInt(formData.doctorId))?.user?.name || 'Unknown'}</p>
            <p><strong>Department:</strong> {departments.find((d) => d.id === parseInt(formData.departmentId))?.name || 'N/A'}</p>
            <p><strong>Date:</strong> {formData.date ? new Date(formData.date).toLocaleString() : 'N/A'}</p>
            <p><strong>Type:</strong> {formData.type}</p>
            <p><strong>Reason:</strong> {formData.reason}</p>
            <p><strong>Notes:</strong> {formData.notes || 'N/A'}</p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={confirmSubmission}
              variant="contained"
              disabled={loading}
              className="bg-hospital-accent text-hospital-white hover:bg-hospital-teal-light rounded-md px-4 py-2"
            >
              Confirm
            </Button>
            <Button
              onClick={() => setOpenConfirm(false)}
              variant="outlined"
              className="border-hospital-gray-300 text-hospital-gray-900 dark:text-hospital-white hover:bg-hospital-gray-100 dark:hover:bg-hospital-gray-700 rounded-md px-4 py-2"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
}