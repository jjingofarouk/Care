// VitalSignsPage.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Edit, Trash2 } from 'lucide-react';
import medicalRecordsService from '@/services/medicalRecordsService';

const VitalSignsPage = ({ onEdit }) => {
  const [vitalSigns, setVitalSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVitalSigns = async () => {
      try {
        setLoading(true);
        const data = await medicalRecordsService.getVitalSigns();
        setVitalSigns(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVitalSigns();
  }, []);

  const handleDelete = async (id) => {
    try {
      await medicalRecordsService.deleteVitalSign(id);
      setVitalSigns(vitalSigns.filter(vital => vital.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (vitalSign) => {
    if (onEdit) {
      onEdit({ resource: 'vitalSign', ...vitalSign });
    } else {
      console.log('Edit vital sign:', vitalSign.id);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'bloodPressure', headerName: 'Blood Pressure', width: 150 },
    { field: 'heartRate', headerName: 'Heart Rate', width: 120 },
    { field: 'temperature', headerName: 'Temperature', width: 120 },
    { field: 'respiratoryRate', headerName: 'Respiratory Rate', width: 150 },
    { field: 'oxygenSaturation', headerName: 'Oxygen Saturation', width: 150 },
    { field: 'recordedAt', headerName: 'Recorded At', width: 150, type: 'date', valueGetter: (params) => new Date(params.row.recordedAt) },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <div className="flex gap-2">
          <IconButton onClick={() => handleEdit(params.row)} className="text-[var(--hospital-accent)]">
            <Edit size={20} />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} className="text-[var(--hospital-error)]">
            <Trash2 size={20} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      {error && (
        <div className="alert alert-error mb-4">
          {error}
        </div>
      )}
      {loading ? (
        <div className="loading-spinner mx-auto" />
      ) : (
        <div className="table">
          <DataGrid
            rows={vitalSigns}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            className="w-full"
            autoHeight
            disableSelectionOnClick
          />
        </div>
      )}
    </div>
  );
};

export default VitalSignsPage;