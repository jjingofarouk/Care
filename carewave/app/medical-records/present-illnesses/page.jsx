'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Edit, Trash2 } from 'lucide-react';
import medicalRecordsService from '@/services/medicalRecordsService';

const PresentIllnessesPage = () => {
  const [illnesses, setIllnesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIllnesses = async () => {
      try {
        setLoading(true);
        const data = await medicalRecordsService.getPresentIllnesses();
        setIllnesses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIllnesses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await medicalRecordsService.deletePresentIllness(id);
      setIllnesses(illnesses.filter(illness => illness.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'narrative', headerName: 'Narrative', width: 300 },
    { field: 'severity', headerName: 'Severity', width: 150 },
    { field: 'progress', headerName: 'Progress', width: 150 },
    { field: 'createdAt', headerName: 'Created', width: 150, type: 'date', valueGetter: (params) => new Date(params.row.createdAt) },
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
            rows={illnesses}
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

export default PresentIllnessesPage;