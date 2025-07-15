'use client';

import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { emergencyService } from '../../services/emergencyService';

export default function AmbulancePage() {
  const [ambulances, setAmbulances] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    status: '',
  });

  useEffect(() => {
    fetchAmbulances();
  }, []);

  const fetchAmbulances = async () => {
    const data = await emergencyService.getAmbulances();
    setAmbulances(data);
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
    { field: 'vehicleNumber', headerName: 'Vehicle Number', width: 150 },
    { field: 'status', headerName: 'Status', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2">
          <a href={`/emergency/ambulance/${params.row.id}`} className="btn btn-primary">View</a>
          <button onClick={() => handleDelete(params.row.id)} className="btn btn-danger">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Ambulances</h2>
      </div>
      <div className="p-6">
        <button onClick={handleOpen} className="btn btn-primary mb-4">Add Ambulance</button>
        <div className="h-[400px] w-full">
          <DataGrid rows={ambulances} columns={columns} pageSize={5} />
        </div>
        {open && (
          <div className="fixed inset-0 bg-hospital-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="card max-w-md w-full">
              <div className="card-header">
                <h2 className="card-title">Add Ambulance</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Vehicle Number"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  className="input w-full"
                />
                <input
                  type="text"
                  placeholder="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input w-full"
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={handleClose} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}