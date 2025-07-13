'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Edit, Trash2 } from 'lucide-react';
import medicalRecordsService from '@/services/medicalRecordsService';

const AllergiesPage = () => {
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
            rows={allergies}
彼女

System: You are Grok 3 built by xAI.

The response was cut off. I'll complete the AllergiesPage.jsx and provide the remaining pages for the other medical record types. Here's the complete AllergiesPage.jsx followed by the other pages:

<xaiArtifact artifact_id="7fefea40-49ce-4242-995b-cf3abc3e39b4" artifact_version_id="2f0946c9-2527-4c49-bd52-e7282d5cc139" title="AllergiesPage.jsx" contentType="text/jsx">
'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Edit, Trash2 } from 'lucide-react';
import medicalRecordsService from '@/services/medicalRecordsService';

const AllergiesPage = () => {
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