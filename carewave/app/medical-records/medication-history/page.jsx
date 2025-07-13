'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Edit, Trash2 } from 'lucide-react';
import medicalRecordsService from '@/services/medicalRecordsService';

const MedicationHistoryPage = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true);
        const data = await medicalRecordsService.getMedicationHistory();
        setMedications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMedications();
  }, []);

  const handleDelete = async (id) => {
    try {
      await medicalRecordsService.deleteMedicationHistory(id);
      setMedications(medications.filter(med => med.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'medicationName', headerName: 'Medication', width: 200 },
    { field: 'dosage', headerName: 'Dosage', width: 150 },
    { field: 'frequency', headerName: 'Frequency', width: 150 },
    { field: 'startDate', headerName: 'Start Date', width: 150, type: 'date', valueGetter: (params) => params.row.startDate ? new Date(params.row.startDate) : null },
    { field: 'endDate', headerName: 'End Date', width: 150, type: 'date', valueGetter: (params) => params.row.endDate ? new Date(params.row.endDate) : null },
    { field: 'isCurrent', headerName: 'Current', width: 100, type: 'boolean' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <div className="flex gap-2">
          <IconButton onClick={() => console.log('Edit', params.row.id)} className="text-[var(--hospital-accent)]">
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
            rows={medications}
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

export default MedicationHistoryPage;