"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getDoctors, updateDoctor, deleteDoctor } from './adtService';
import styles from './DoctorList.module.css';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const data = await getDoctors();
        setDoctors(data.map(doctor => ({
          id: doctor.id,
          name: doctor.user?.name || 'N/A',
          doctorId: doctor.doctorId || 'N/A',
          email: doctor.user?.email || 'N/A',
          specialty: doctor.specialty || 'N/A',
          licenseNumber: doctor.licenseNumber || 'N/A',
          phone: doctor.phone || 'N/A',
          office: doctor.office || 'N/A',
        })));
        setError(null);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError(error.response?.data?.details || error.message);
      }
    }
    fetchDoctors();
  }, []);

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
      console.error('Error updating doctor:', error);
      setError(error.response?.data?.details || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      setDoctors(doctors.filter(row => row.id !== id));
    } catch (error) {
      console.error('Error deleting doctor:', error);
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
          className={styles.actionButton}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Doctors List
      </Typography>
      {error && (
        <Alert severity="error" className={styles.alert}>
          Failed to load doctors: {error}
        </Alert>
      )}
      {doctors.length === 0 && !error && (
        <Alert severity="info" className={styles.alert}>
          No doctors found.
        </Alert>
      )}
      <Box className={styles.tableWrapper}>
        <DataGrid
          rows={doctors}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          className={styles.dataGrid}
          onCellEditStop={handleCellEditStop}
        />
      </Box>
    </Box>
  );
}