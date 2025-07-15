'use client';

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { assetsService } from '../services/assetsService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FixedAssetsPage() {
  const [assets, setAssets] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    purchaseDate: '',
    cost: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assetsService.getAssets();
      console.log('Fetched assets:', data); // Debug log
      setAssets(data || []); // Ensure we always have an array
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to fetch assets');
      setAssets([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', purchaseDate: '', cost: '' });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await assetsService.createAsset(formData);
      await fetchAssets();
      handleClose();
    } catch (err) {
      console.error('Error creating asset:', err);
      setError('Failed to create asset');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      await assetsService.deleteAsset(id);
      await fetchAssets();
    } catch (err) {
      console.error('Error deleting asset:', err);
      setError('Failed to delete asset');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAsset = (id) => {
    router.push(`/fixed-assets/${id}`);
  };

  const columns = [
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
    { field: 'name', headerName: 'Asset Name', width: 200, flex: 1 },
    { 
      field: 'purchaseDate', 
      headerName: 'Purchase Date', 
      width: 150, 
      type: 'date',
      valueGetter: (value, row) => {
        // Updated for newer MUI DataGrid versions
        const dateValue = row.purchaseDate;
        if (!dateValue) return null;
        try {
          return new Date(dateValue);
        } catch (error) {
          console.error('Error parsing date:', dateValue, error);
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
      field: 'cost', 
      headerName: 'Cost', 
      width: 150, 
      type: 'number',
      valueFormatter: (value) => {
        // Updated for newer MUI DataGrid versions
        if (value == null || value === undefined) return '$0.00';
        try {
          return `$${Number(value).toFixed(2)}`;
        } catch (error) {
          console.error('Error formatting cost:', value, error);
          return '$0.00';
        }
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button 
            onClick={() => handleViewAsset(params.row.id)} 
            className="btn btn-primary flex items-center gap-2"
            style={{ fontSize: '12px', padding: '4px 8px' }}
          >
            View
          </button>
          <button 
            onClick={() => handleDelete(params.row.id)} 
            className="btn btn-danger flex items-center gap-2"
            style={{ fontSize: '12px', padding: '4px 8px' }}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
    },
  ];

  // Ensure assets is always an array and has proper structure
  const processedAssets = Array.isArray(assets) ? assets.map(asset => ({
    ...asset,
    id: asset.id || Math.random().toString(36).substr(2, 9), // Fallback ID
    name: asset.name || 'Unnamed Asset',
    purchaseDate: asset.purchaseDate || null,
    cost: asset.cost || 0
  })) : [];

  return (
    <div className="card w-full max-w-[100vw] mx-0 p-0">
      <div className="card-header px-2 py-1">
        <h2 className="card-title text-lg">
          {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Fixed Assets'}
        </h2>
      </div>
      <div className="p-2">
        {error && (
          <div className="alert alert-error mb-2">
            {error}
          </div>
        )}
        
        {loading ? (
          <Skeleton width={150} height={36} baseColor="#e5e7eb" highlightColor="#f3f4f6" className="mb-2" />
        ) : (
          <button onClick={handleOpen} className="btn btn-primary mb-2 flex items-center gap-2">
            <PlusCircle size={16} /> Add Asset
          </button>
        )}
        
        <div className="h-[400px] w-full">
          {loading ? (
            <Skeleton count={5} height={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          ) : (
            <DataGrid 
              rows={processedAssets} 
              columns={columns} 
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
              onError={(error) => {
                console.error('DataGrid error:', error);
                setError('Error in data grid: ' + error.message);
              }}
              getRowId={(row) => row.id}
              loading={loading}
            />
          )}
        </div>
        
        {open && (
          <div className="fixed inset-0 bg-hospital-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="card max-w-md w-full mx-2 p-0">
              <div className="card-header px-2 py-1">
                <h2 className="card-title text-lg">
                  {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Add Fixed Asset'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-2 space-y-2">
                {error && (
                  <div className="alert alert-error">
                    {error}
                  </div>
                )}
                
                {loading ? (
                  <>
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Asset Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input w-full"
                      required
                    />
                    <input
                      type="date"
                      placeholder="Purchase Date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      className="input w-full"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Cost"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      className="input w-full"
                      min="0"
                      step="0.01"
                      required
                    />
                  </>
                )}
                <div className="flex justify-end gap-2">
                  {loading ? (
                    <Skeleton width={100} height={36} count={2} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                  ) : (
                    <>
                      <button type="button" onClick={handleClose} className="btn btn-secondary">Cancel</button>
                      <button type="submit" className="btn btn-primary">Save</button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}