'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Chip, Alert } from '@mui/material';
import { Loader } from 'lucide-react';
import adtService from '../../services/adtService';

export default function BedStatus({ wardId }) {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchBeds();
  }, [wardId]);

  const fetchBeds = async () => {
    try {
      setLoading(true);
      setError(null);
      const bedData = await adtService.getBeds(wardId ? { wardId } : {});
      setBeds(bedData);
    } catch (error) {
      console.error('Error fetching beds:', error);
      setError('Failed to load bed status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (bedId, isOccupied) => {
    try {
      setUpdating(bedId);
      await adtService.updateBedStatus(bedId, !isOccupied);
      await fetchBeds();
    } catch (error) {
      console.error('Error updating bed status:', error);
      setError('Failed to update bed status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const columns = [
    { 
      field: 'bedNumber', 
      headerName: 'Bed Number', 
      flex: 1,
      minWidth: 100,
      valueGetter: (value, row) => row.bedNumber || 'N/A'
    },
    { 
      field: 'wardName', 
      headerName: 'Ward', 
      flex: 1,
      minWidth: 120,
      valueGetter: (value, row) => row.wardName || row.ward?.name || 'N/A'
    },
    {
      field: 'isOccupied',
      headerName: 'Status',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Occupied' : 'Available'}
          className={params.value ? 'badge-error' : 'badge-success'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'patientName',
      headerName: 'Patient',
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => {
        if (!row.isOccupied) return 'N/A';
        if (row.patient?.name) return row.patient.name;
        if (row.patient?.firstName && row.patient?.lastName) {
          return `${row.patient.firstName} ${row.patient.lastName}`;
        }
        if (row.admission?.patient?.name) return row.admission.patient.name;
        if (row.admission?.patient?.firstName && row.admission?.patient?.lastName) {
          return `${row.admission.patient.firstName} ${row.admission.patient.lastName}`;
        }
        return 'Occupied';
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Button
          className={`btn ${updating === params.row.id ? 'btn-secondary' : 'btn-outline'}`}
          onClick={() => handleToggleStatus(params.row.id, params.row.isOccupied)}
          disabled={updating === params.row.id}
        >
          {updating === params.row.id ? 'Updating...' : 'Toggle Status'}
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="card flex justify-center items-center h-48">
        <Loader className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="card w-full">
      {error && (
        <Alert className="alert alert-error mb-2">
          {error}
        </Alert>
      )}
      
      <div className="w-full overflow-x-auto custom-scrollbar">
        <DataGrid
          rows={beds}
          columns={columns}
          getRowId={(row) => row.id || `${row.bedNumber}-${row.wardName}`}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          autoHeight
          disableRowSelectionOnClick
          className="table"
          classes={{
            root: 'bg-[var(--hospital-white)]',
            columnHeaders: 'bg-[var(--hospital-gray-50)]',
            columnHeader: 'text-[var(--hospital-gray-500)] uppercase tracking-wider',
            cell: 'text-[var(--hospital-gray-900)] border-t border-[var(--hospital-gray-200)]',
            row: 'hover:bg-[var(--hospital-gray-50)]',
          }}
        />
      </div>
    </div>
  );
}