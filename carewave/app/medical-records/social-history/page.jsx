'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Edit, Trash2 } from 'lucide-react';
import medicalRecordsService from '@/services/medicalRecordsService';

const SocialHistoryPage = () => {
  const [socialHistory, setSocialHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSocialHistory = async () => {
      try {
        setLoading(true);
        const data = await medicalRecordsService.getSocialHistory();
        setSocialHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSocialHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await medicalRecordsService.deleteSocialHistory(id);
      setSocialHistory(socialHistory.filter(history => history.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'smokingStatus', headerName: 'Smoking Status', width: 150 },
    { field: 'alcoholUse', headerName: 'Alcohol Use', width: 150 },
    { field: 'occupation', headerName: 'Occupation', width: 200 },
    { field: 'maritalStatus', headerName: 'Marital Status', width: 150 },
    { field: 'livingSituation', headerName: 'Living Situation', width: 200 },
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
            rows={socialHistory}
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

export default SocialHistoryPage;