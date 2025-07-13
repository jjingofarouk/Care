'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Edit, Trash2 } from 'lucide-react';
import medicalRecordsService from '@/services/medicalRecordsService';

const TravelHistoryPage = () => {
  const [travelHistory, setTravelHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTravelHistory = async () => {
      try {
        setLoading(true);
        const data = await medicalRecordsService.getTravelHistory();
        setTravelHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTravelHistory();
  }, []);

  const handleDelete = async (id) => {
    try {
      await medicalRecordsService.deleteTravelHistory(id);
      setTravelHistory(travelHistory.filter(travel => travel.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'countryVisited', headerName: 'Country Visited', width: 200 },
    { field: 'dateFrom', headerName: 'Date From', width: 150, type: 'date', valueGetter: (params) => params.row.dateFrom ? new Date(params.row.dateFrom) : null },
    { field: 'dateTo', headerName: 'Date To', width: 150, type: 'date', valueGetter: (params) => params.row.dateTo ? new Date(params.row.dateTo) : null },
    { field: 'purpose', headerName: 'Purpose', width: 200 },
    { field: 'travelNotes', headerName: 'Notes', width: 300 },
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
            rows={travelHistory}
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

export default TravelHistoryPage;