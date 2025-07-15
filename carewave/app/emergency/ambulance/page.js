'use client';

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { emergencyService } from '../../services/emergencyService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function AmbulancePage() {
  const [ambulances, setAmbulances] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    status: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAmbulances();
  }, []);

  const fetchAmbulances = async () => {
    setLoading(true);
    const data = await emergencyService.getAmbulances();
    setAmbulances(data);
    setLoading(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ vehicleNumber: '', status: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await emergencyService.createAmbulance(formData);
    await fetchAmbulances();
    handleClose();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await emergencyService.deleteAmbulance(id);
    await fetchAmbulances();
    setLoading(false);
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
        <div className="flex gap-2">
          <a href={`/emergency/ambulance/${params.row.id}`} className="btn btn-primary">View</a>
          <button onClick={() => handleDelete(params.row.id)} className="btn btn-danger">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="card w-full max-w-[100vw] mx-0 p-0">
      <div className="card-header px-2 py-1">
        <h2 className="card-title text-lg">
          {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Ambulance Fleet Management'}
        </h2>
      </div>
      <div className="p-2">
        {loading ? (
          <Skeleton width={150} height={36} baseColor="#e5e7eb" highlightColor="#f3f4f6" className="mb-2" />
        ) : (
          <button onClick={handleOpen} className="btn btn-primary mb-2">Add Ambulance</button>
        )}
        <div className="h-[400px] w-full">
          {loading ? (
            <Skeleton count={5} height={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          ) : (
            <DataGrid rows={ambulances} columns={columns} pageSize={10} rowsPerPageOptions={[10, 25, 50]} />
          )}
        </div>
        {open && (
          <div className="fixed inset-0 bg-hospital-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="card max-w-md w-full mx-2 p-0">
              <div className="card-header px-2 py-1">
                <h2 className="card-title text-lg">
                  {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Add New Ambulance'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-2 space-y-2">
                {loading ? (
                  <>
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Vehicle Number"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                      className="input w-full"
                    />
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="input w-full"
                    >
                      <option value="">Select Status</option>
                      <option value="Available">Available</option>
                      <option value="In Use">In Use</option>
                      <option value="Out of Service">Out of Service</option>
                    </select>
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