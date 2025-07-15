'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { assetsService } from '../../services/assetsService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DataGrid } from '@mui/x-data-grid';
import { Calendar, DollarSign, FileText, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AssetDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchAsset();
    }
  }, [id]);

  const fetchAsset = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assetsService.getAsset(id);
      console.log('Fetched asset:', data); // Debug log
      setAsset(data);
    } catch (err) {
      console.error('Error fetching asset:', err);
      setError('Failed to fetch asset details');
    } finally {
      setLoading(false);
    }
  };

  const depreciationColumns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 200,
      renderCell: (params) => (
        <div style={{ wordBreak: 'break-all' }}>
          {params.value}
        </div>
      )
    },
    { 
      field: 'depreciationDate', 
      headerName: 'Depreciation Date', 
      width: 180, 
      type: 'date', 
      valueGetter: (value, row) => {
        const dateValue = row.depreciationDate;
        if (!dateValue) return null;
        try {
          return new Date(dateValue);
        } catch (error) {
          console.error('Error parsing depreciation date:', dateValue, error);
          return null;
        }
      },
      renderCell: (params) => {
        if (!params.value) return 'N/A';
        try {
          return new Date(params.value).toLocaleDateString();
        } catch (error) {
          return 'Invalid Date';
        }
      }
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      width: 150, 
      type: 'number', 
      valueFormatter: (value) => {
        if (value == null || value === undefined) return '$0.00';
        try {
          return `$${Number(value).toFixed(2)}`;
        } catch (error) {
          console.error('Error formatting amount:', value, error);
          return '$0.00';
        }
      }
    },
  ];

  const auditColumns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 200,
      renderCell: (params) => (
        <div style={{ wordBreak: 'break-all' }}>
          {params.value}
        </div>
      )
    },
    { 
      field: 'auditDate', 
      headerName: 'Audit Date', 
      width: 150, 
      type: 'date', 
      valueGetter: (value, row) => {
        const dateValue = row.auditDate;
        if (!dateValue) return null;
        try {
          return new Date(dateValue);
        } catch (error) {
          console.error('Error parsing audit date:', dateValue, error);
          return null;
        }
      },
      renderCell: (params) => {
        if (!params.value) return 'N/A';
        try {
          return new Date(params.value).toLocaleDateString();
        } catch (error) {
          return 'Invalid Date';
        }
      }
    },
    { 
      field: 'findings', 
      headerName: 'Findings', 
      width: 300, 
      flex: 1,
      renderCell: (params) => (
        <div style={{ 
          whiteSpace: 'pre-wrap', 
          wordBreak: 'break-word',
          maxHeight: '100px',
          overflow: 'auto'
        }}>
          {params.value || 'No findings'}
        </div>
      )
    },
  ];

  // Process data to ensure proper structure
  const processedDepreciationSchedules = Array.isArray(asset?.depreciationSchedules) 
    ? asset.depreciationSchedules.map(schedule => ({
        ...schedule,
        id: schedule.id || Math.random().toString(36).substr(2, 9),
        depreciationDate: schedule.depreciationDate || null,
        amount: schedule.amount || 0
      }))
    : [];

  const processedAssetAudits = Array.isArray(asset?.assetAudits) 
    ? asset.assetAudits.map(audit => ({
        ...audit,
        id: audit.id || Math.random().toString(36).substr(2, 9),
        auditDate: audit.auditDate || null,
        findings: audit.findings || ''
      }))
    : [];

  return (
    <div className="card w-full max-w-[100vw] mx-0 p-0">
      <div className="card-header px-2 py-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.back()} 
            className="btn btn-ghost p-1"
            title="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="card-title text-lg">
            {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Asset Details'}
          </h2>
        </div>
      </div>
      
      <div className="p-2 space-y-4">
        {error && (
          <div className="alert alert-error mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <Skeleton count={3} height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
        ) : (
          asset && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                <p><strong>Name:</strong> {asset.name || 'N/A'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-green-600" />
                <p><strong>Purchase Date:</strong> {
                  asset.purchaseDate 
                    ? new Date(asset.purchaseDate).toLocaleDateString() 
                    : 'N/A'
                }</p>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-yellow-600" />
                <p><strong>Cost:</strong> ${
                  asset.cost 
                    ? Number(asset.cost).toFixed(2) 
                    : '0.00'
                }</p>
              </div>
            </div>
          )
        )}

        <div>
          <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
            {loading ? (
              <Skeleton width={150} height={20} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
            ) : (
              <>
                <Calendar size={18} />
                Depreciation Schedules ({processedDepreciationSchedules.length})
              </>
            )}
          </h3>
          <div className="h-[300px] w-full">
            {loading ? (
              <Skeleton count={4} height={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
            ) : (
              <DataGrid 
                rows={processedDepreciationSchedules} 
                columns={depreciationColumns} 
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                sx={{
                  '& .MuiDataGrid-cell': {
                    padding: '8px',
                  },
                  '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#f8f9fa',
                  },
                }}
                getRowId={(row) => row.id}
                slots={{
                  noRowsOverlay: () => (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No depreciation schedules found</p>
                    </div>
                  ),
                }}
              />
            )}
          </div>
        </div>

        <div>
          <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
            {loading ? (
              <Skeleton width={150} height={20} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
            ) : (
              <>
                <FileText size={18} />
                Asset Audits ({processedAssetAudits.length})
              </>
            )}
          </h3>
          <div className="h-[300px] w-full">
            {loading ? (
              <Skeleton count={4} height={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
            ) : (
              <DataGrid 
                rows={processedAssetAudits} 
                columns={auditColumns} 
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                sx={{
                  '& .MuiDataGrid-cell': {
                    padding: '8px',
                  },
                  '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#f8f9fa',
                  },
                  '& .MuiDataGrid-row': {
                    minHeight: '60px !important',
                  },
                }}
                getRowId={(row) => row.id}
                slots={{
                  noRowsOverlay: () => (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No asset audits found</p>
                    </div>
                  ),
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}