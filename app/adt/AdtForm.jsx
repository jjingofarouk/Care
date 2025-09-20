"use client";
import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Autocomplete } from '@mui/material';
import { createAdmission, updateAdmission, getPatients } from './adtService';

export default function AdmissionForm({ admission, onSubmit, doctors, wards }) {
  const [formData, setFormData] = useState({
    patientId: admission?.patientId || '',
    wardId: admission?.wardId || '',
    admissionDate: admission?.admissionDate ? new Date(admission.admissionDate).toISOString().split('T')[0] : '',
    doctorId: admission?.doctorId || '',
    status: admission?.status || 'ADMITTED',
    triagePriority: admission?.triagePriority || '',
    triageNotes: admission?.triageNotes || '',
    presentingComplaints: admission?.presentingComplaints || '',
    relayedInfo: admission?.relayedInfo || '',
    dischargeNotes: admission?.dischargeNotes || '',
    dischargeDate: admission?.dischargeDate ? new Date(admission.dischargeDate).toISOString().split('T')[0] : '',
  });
  const [patients, setPatients] = useState([]);

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
    if (admission?.id) {
      setFormData({
        patientId: admission.patientId,
        wardId: admission.wardId || '',
        admissionDate: admission.admissionDate ? new Date(admission.admissionDate).toISOString().split('T')[0] : '',
        doctorId: admission.doctorId || '',
        status: admission.status || 'ADMITTED',
        triagePriority: admission.triagePriority || '',
        triageNotes: admission.triageNotes || '',
        presentingComplaints: admission.presentingComplaints || '',
        relayedInfo: admission.relayedInfo || '',
        dischargeNotes: admission.dischargeNotes || '',
        dischargeDate: admission.dischargeDate ? new Date(admission.dischargeDate).toISOString().split('T')[0] : '',
      });
    }
  }, [admission]);

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
      if (admission?.id) {
        await updateAdmission(admission.id, formData);
      } else {
        await createAdmission(formData);
      }
      onSubmit();
      setFormData({
        patientId: '',
        wardId: '',
        admissionDate: '',
        doctorId: '',
        status: 'ADMITTED',
        triagePriority: '',
        triageNotes: '',
        presentingComplaints: '',
        relayedInfo: '',
        dischargeNotes: '',
        dischargeDate: '',
      });
    } catch (error) {
      console.error('Error submitting admission:', error);
    }
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="bg-hospital-white dark:bg-hospital-gray-900 p-6 mb-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-hospital-gray-900 dark:text-hospital-white mb-4">
          {admission?.id ? 'Update Admission' : 'New Admission'}
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
                  className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md"
                />
              )}
            />
            <TextField
              select
              label="Ward"
              name="wardId"
              value={formData.wardId}
              onChange={handleChange}
              fullWidth
              className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            >
              {wards.map((ward) => (
                <MenuItem key={ward.id} value={ward.id}>
                  {ward.name} ({ward.occupiedBeds}/{ward.totalBeds})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="date"
              label="Admission Date"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
              className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            />
            <TextField
              select
              label="Doctor"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              fullWidth
              className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.user.name} ({doctor.specialty})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
              required
              className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            >
              <MenuItem value="ADMITTED">Admitted</MenuItem>
              <MenuItem value="DISCHARGED">Discharged</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
            </TextField>
            <TextField
              select
              label="Triage Priority"
              name="triagePriority"
              value={formData.triagePriority}
              onChange={handleChange}
              fullWidth
              className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </TextField>
            <TextField
              label="Presenting Complaints"
              name="presentingComplaints"
              value={formData.presentingComplaints}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md col-span-1 sm:col-span-2"
            />
            <TextField
              label="Relayed Information"
              name="relayedInfo"
              value={formData.relayedInfo}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md col-span-1 sm:col-span-2"
            />
            <TextField
              label="Triage Notes"
              name="triageNotes"
              value={formData.triageNotes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md col-span-1 sm:col-span-2"
            />
            <TextField
              label="Discharge Notes"
              name="dischargeNotes"
              value={formData.dischargeNotes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md col-span-1 sm:col-span-2"
            />
            <TextField
              type="date"
              label="Discharge Date"
              name="dischargeDate"
              value={formData.dischargeDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            />
            <div className="col-span-1 sm:col-span-2">
              <Button
                type="submit"
                variant="contained"
                className="bg-hospital-accent text-hospital-white hover:bg-hospital-teal-light transition-transform duration-fast ease-in-out transform hover:-translate-y-1 rounded-md px-4 py-2 w-full"
              >
                {admission?.id ? 'Update Admission' : 'Add Admission'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}