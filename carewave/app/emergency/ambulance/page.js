'use client';

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { emergencyService } from '../../services/emergencyService';

export default function AmbulancePage() {
  const [ambulances, setAmbulances] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    status: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAmbulances();
  }, []);

  const fetchAmbulances = async () => {
    setIsLoading(true);
    const data = await emergencyService.getAmbulances();
    setAmbulances(data);
    setIsLoading(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ vehicleNumber: '', status: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await emergencyService.createAmbulance(formData);
    fetchAmbulances();
    handleClose();
  };

  const handleDelete = async (id) => {
    await emergencyService.deleteAmbulance(id);
    fetchAmbulances();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'vehicleNumber', headerName: 'Vehicle Number', width: 200 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 200,
      renderCell: (params) => (
        <span className={`badge ${
          params.value === 'Available' ? 'badge-success' :
          params.value === 'In Use' ? 'badge-warning' :
          params.value === 'Out of Service' ? 'badge-error' : 'badge-neutral'
        }`}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <div className="flex gap-3">
          <a 
            href={`/emergency/ambulance/${params.row.id}`} 
            className="btn btn-primary text-sm px-4 py-2 hover:bg-[var(--hospital-accent-dark)] transition-all duration-300"
          >
            View
          </a>
          <button 
            onClick={() => handleDelete(params.row.id)} 
            className="btn btn-danger text-sm px-4 py-2 hover:bg-[var(--hospital-error-dark)] transition-all duration-300"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--hospital-gray-50)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="card glass animate-fade-in">
          <div className="card-header border-b-0 pb-0">
            <h2 className="card-title text-2xl text-gradient">Ambulance Fleet Management</h2>
            <p className="card-subtitle mt-1">Track and manage ambulance vehicles</p>
          </div>
          <div className="p-6 sm:p-8">
            <div className="flex justify-end mb-6">
              <button 
                onClick={handleOpen} 
                className="btn btn-primary relative overflow-hidden group px-6 py-3"
              >
                <span className="relative z-10">Add Ambulance</span>
                <span className="absolute inset-0 bg-[var(--hospital-accent-dark)] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <div className="skeleton h-12 w-full rounded-lg"></div>
                <div className="skeleton h-12 w-full rounded-lg"></div>
                <div className="skeleton h-12 w-full rounded-lg"></div>
                <div className="skeleton h-12 w-full rounded-lg"></div>
              </div>
            ) : (
              <div className="w-full custom-scrollbar" style={{ height: 500 }}>
                <DataGrid 
                  rows={ambulances} 
                  columns={columns} 
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  className="bg-[var(--hospital-white)] rounded-lg border-[var(--hospital-gray-200)]"
                  sx={{
                    '& .MuiDataGrid-root': {
                      border: 'none',
                    },
                    '& .MuiDataGrid-cell': {
                      borderBottom: `1px solid var(--hospital-gray-200)`,
                      padding: '12px',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: 'var(--hospital-gray-50)',
                      color: 'var(--hospital-gray-600)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                    },
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: 'var(--hospital-gray-50)',
                    },
                    '& .MuiDataGrid-footerContainer': {
                      backgroundColor: 'var(--hospital-gray-50)',
                      borderTop: `1px solid var(--hospital-gray-200)`,
                    },
                  }}
                />
              </div>
            )}

            {open && (
              <div className="fixed inset-0 bg-[var(--hospital-gray-900)] bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                <div className="card glass max-w-md w-full animate-slide-up">
                  <div className="card-header border-b-0 pb-0">
                    <h2 className="card-title text-xl text-gradient">Add New Ambulance</h2>
                  </div>
                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--hospital-gray-600)]">Vehicle Number</label>
                      <input
                        type="text"
                        value={formData.vehicleNumber}
                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                        className="input w-full focus:ring-2 focus:ring-[var(--hospital-accent)] transition-all duration-300"
                        placeholder="Enter vehicle number"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--hospital-gray-600)]">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="select w-full focus:ring-2 focus:ring-[var(--hospital-accent)] transition-all duration-300"
                      >
                        <option value="">Select Status</option>
                        <option value="Available">Available</option>
                        <option value="In Use">In Use</option>
                        <option value="Out of Service">Out of Service</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <button 
                        type="button" 
                        onClick={handleClose} 
                        className="btn btn-outline px-6 py-3 hover:bg-[var(--hospital-gray-100)]"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary px-6 py-3 relative overflow-hidden group"
                      >
                        <span className="relative z-10">Save</span>
                        <span className="absolute inset-0 bg-[var(--hospital-accent-dark)] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}