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

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    const data = await vaccinationService.getSchedules();
    setSchedules(data);
    setLoading(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Schedule Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 400 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      valueGetter: (params) => new Date(params.row.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="card w-full max-w-[100vw] mx-0 p-0">
      <div className="card-header px-2 py-1">
        <h2 className="card-title text-lg">
          {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Immunization Schedules'}
        </h2>
      </div>
      <div className="p-2">
        <div className="h-[400px] w-full">
          {loading ? (
            <Skeleton count={5} height={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          ) : (
            <DataGrid
              rows={schedules}
              columns={columns}
              initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
              pageSizeOptions={[5, 10, 25]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
