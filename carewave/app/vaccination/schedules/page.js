// app/vaccination/schedules/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { vaccinationService } from '../../services/vaccinationService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await vaccinationService.getSchedules();
      setSchedules(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch schedules');
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Schedule Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 400 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      valueGetter: (value, row) => new Date(row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100vw', margin: 0, padding: 0 }}>
      <div style={{ padding: '8px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
          {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Immunization Schedules'}
        </h2>
      </div>
      <div style={{ padding: '8px' }}>
        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '8px', 
            borderRadius: '4px', 
            marginBottom: '8px' 
          }}>
            {error}
          </div>
        )}
        <div style={{ height: '400px', width: '100%' }}>
          {loading ? (
            <Skeleton count={5} height={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          ) : (
            <DataGrid
              rows={schedules}
              columns={columns}
              initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
            />
          )}
        </div>
      </div>
    </div>
  );
}