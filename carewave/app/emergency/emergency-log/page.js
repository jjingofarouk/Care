'use client';

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { emergencyService } from '../../services/emergencyService';

export default function EmergencyLogPage() {
  const [logs, setLogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    emergencyCaseId: '',
    description: '',
    loggedAt: '',
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const data = await emergencyService.getEmergencyLogs();
    setLogs(data);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ emergencyCaseId: '', description: '', loggedAt: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await emergencyService.createEmergencyLog(formData);
    fetchLogs();
    handleClose();
  };

  const handleDelete = async (id) => {
    await emergencyService.deleteEmergencyLog(id);
    fetchLogs();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'emergencyCaseId', headerName: 'Emergency Case ID', width: 150 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'loggedAt', headerName: 'Logged At', width: 200, valueFormatter: ({ value }) => new Date(value).toLocaleString() },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2">
          <a href={`/emergency/emergency-log/${params.row.id}`} className="btn btn-primary">View</a>
          <button onClick={() => handleDelete(params.row.id)} className="btn btn-danger">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Emergency Logs</h2>
      </div>
      <div className="p-6">
        <button onClick={handleOpen} className="btn btn-primary mb-4">Add Emergency Log</button>
        <div className="h-[400px] w-full">
          <DataGrid rows={logs} columns={columns} pageSize={5} />
        </div>
        {open && (
          <div className="fixed inset-0 bg-hospital-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="card max-w-md w-full">
              <div className="card-header">
                <h2 className="card-title">Add Emergency Log</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Emergency Case ID"
                  value={formData.emergencyCaseId}
                  onChange={(e) => setFormData({ ...formData, emergencyCaseId: e.target.value })}
                  className="input w-full"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input w-full"
                />
                <input
                  type="datetime-local"
                  placeholder="Logged At"
                  value={formData.loggedAt}
                  onChange={(e) => setFormData({ ...formData, loggedAt: e.target.value })}
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