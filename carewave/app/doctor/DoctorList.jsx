"use client";
import React, { useState, useEffect } from 'react';
import { Alert, Button, TextField, MenuItem } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import { getDoctors, updateDoctor, deleteDoctor } from './doctorService';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        const data = await getDoctors();
        const mappedDoctors = data.map(doctor => ({
          id: doctor.id,
          name: doctor.user?.name || 'N/A',
          doctorId: doctor.doctorId || 'N/A',
          email: doctor.user?.email || 'N/A',
          specialty: doctor.specialty || 'N/A',
          licenseNumber: doctor.licenseNumber || 'N/A',
          phone: doctor.phone || 'N/A',
          office: doctor.office || 'N/A',
        }));
        setDoctors(mappedDoctors);
        setFilteredDoctors(mappedDoctors);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.details || error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(doctor =>
      (doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
       doctor.doctorId.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (specialtyFilter ? doctor.specialty === specialtyFilter : true)
    );
    setFilteredDoctors(filtered);
  }, [searchQuery, specialtyFilter, doctors]);

  const handleCellEditStop = async (params) => {
    try {
      const updatedData = {
        name: params.row.name,
        email: params.row.email,
        specialty: params.row.specialty,
        licenseNumber: params.row.licenseNumber,
        phone: params.row.phone || null,
        office: params.row.office || null,
        [params.field]: params.value,
      };
      await updateDoctor(params.id, updatedData);
      setDoctors(doctors.map(row =>
        row.id === params.id ? { ...row, [params.field]: params.value } : row
      ));
    } catch (error) {
      setError(error.response?.data?.details || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      setDoctors(doctors.filter(row => row.id !== id));
    } catch (error) {
      setError(error.response?.data?.details || error.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'doctorId', headerName: 'Doctor ID', width: 120 },
    { field: 'email', headerName: 'Email', width: 180, editable: true },
    { field: 'specialty', headerName: 'Specialty', width: 150, editable: true },
    { field: 'licenseNumber', headerName: 'License Number', width: 150, editable: true },
    { field: 'phone', headerName: 'Phone', width: 120, editable: true },
    { field: 'office', headerName: 'Office', width: 120, editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(params.row.id)}
          className="border-hospital-error text-hospital-error hover:bg-hospital-error hover:text-hospital-white rounded-md px-4 py-2"
        >
          Delete
        </Button>
      ),
    },
  ];

  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))].filter(s => s !== 'N/A');

  const CustomToolbar = () => (
    <GridToolbarContainer className="flex items-center p-4 bg-hospital-gray-50 dark:bg-hospital-gray-800">
      <TextField
        label="Search by Name, ID, or Email"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mr-4 w-64 bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
      />
      <TextField
        label="Filter by Specialty"
        select
        variant="outlined"
        size="small"
        value={specialtyFilter}
        onChange={(e) => setSpecialtyFilter(e.target.value)}
        className="mr-4 w-48 bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
      >
        <MenuItem value="">All Specialties</MenuItem>
        {specialties.map(specialty => (
          <MenuItem key={specialty} value={specialty}>{specialty}</MenuItem>
        ))}
      </TextField>
      <GridToolbarFilterButton className="text-hospital-gray-900 dark:text-hospital-white" />
    </GridToolbarContainer>
  );

  return (
    <div className="p-6 bg-hospital-white dark:bg-hospital-gray-900">
      <h2 className="text-lg font-semibold text-hospital-gray-900 dark:text-hospital-white mb-4">Doctors List</h2>
      {error && (
        <Alert severity="error" className="mb-4">
          Failed to load doctors: {error}
        </Alert>
      )}
      {loading ? (
        <div className="space-y-4">
          <div className="h-16 bg-hospital-gray-100 dark:bg-hospital-gray-700 rounded-md animate-pulse"></div>
          <div className="h-96 bg-hospital-gray-100 dark:bg-hospital-gray-700 rounded-md animate-pulse"></div>
        </div>
      ) : doctors.length === 0 && !error ? (
        <Alert severity="info" className="mb-4">
          No doctors found.
        </Alert>
      ) : (
        <div className="mt-4">
          <DataGrid
            rows={filteredDoctors}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md shadow-md"
            onCellEditStop={handleCellEditStop}
            slots={{ toolbar: CustomToolbar }}
          />
        </div>
      )}
    </div>
  );
}