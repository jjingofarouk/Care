// AllergiesPage.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Edit, Trash2 } from 'lucide-react';
import medicalRecordsService from '@/services/medicalRecordsService';

const AllergiesPage = ({ onEdit }) => {
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllergies = async () => {
      try {
        setLoading(true);
        const data = await medicalRecordsService.getAllergies();
        setAllergies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAllergies();
  }, []);

  const handleDelete = async (id) => {
    try {
      await medicalRecordsService.deleteAllergy(id);
      setAllergies(allergies.filter(allergy => allergy.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (allergy) => {
    if (onEdit) {
      onEdit({ resource: 'allergy', ...allergy });
    } else {
      console.log('Edit allergy:', allergy.id);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Allergy', width: 200 },
    { field: 'severity', headerName: 'Severity', width: 150 },
    { field: 'createdAt', headerName: 'Created', width: 150, type: 'date', valueGetter: (params) => new Date(params.row.createdAt) },
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
            rows={allergies}
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

export default AllergiesPage;