'use client';

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { emergencyService } from '../../services/emergencyService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function EmergencyLogPage() {
  const [logs, setLogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    emergencyCaseId: '',
    description: '',
    loggedAt: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await emergencyService.getEmergencyLogs();
    setLogs(data);
    setLoading(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ emergencyCaseId: '', description: '', loggedAt: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await emergencyService.createEmergencyLog(formData);
    await fetchLogs();
    handleClose();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await emergencyService.deleteEmergencyLog(id);
    await fetchLogs();
    setLoading(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'emergencyCaseId', headerName: 'Emergency Case ID', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { 
      field: 'loggedAt', 
      headerName: 'Logged At', 
      width: 200, 
      valueFormatter: ({ value }) => new Date(value).toLocaleString() 
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <div className="flex gap-2">
          <a href={`/emergency/emergency-log/${params.row.id}`} className="btn btn-primary">View</a>
          <button onClick={() => handleDelete(params.row.id)} className="btn btn-danger">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="card w-full max-w-[100vw] mx-0 p-0">
      <div className="card-header px-2 py-1">
        <h2 className="card-title text-lg">
          {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Emergency Logs'}
        </h2>
      </div>
      <div className="p-2">
        {loading ? (
          <Skeleton width={150} height={36} baseColor="#e5e7eb" highlightColor="#f3f4f6" className="mb-2" />
        ) : (
          <button onClick={handleOpen} className="btn btn-primary mb-2">Add Emergency Log</button>
        )}
        <div className="h-[400px] w-full">
          {loading ? (
            <Skeleton count={5} height={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          ) : (
            <DataGrid rows={logs} columns={columns} pageSize={10} rowsPerPageOptions={[10, 25, 50]} />
          )}
        </div>
        {open && (
          <div className="fixed inset-0 bg-hospital-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="card max-w-md w-full mx-2 p-0">
              <div className="card-header px-2 py-1">
                <h2 className="card-title text-lg">
                  {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Add Emergency Log'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-2 space-y-2">
                {loading ? (
                  <>
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton height={80} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Emergency Case ID"
                      value={formData.emergencyCaseId}
                      onChange={(e) => setFormData({ ...formData, emergencyCaseId: e.target.value })}
                      className="input w-full"
                    />
                    <textarea
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="input w-full h-24"
                    />
                    <input
                      type="datetime-local"
                      placeholder="Logged At"
                      value={formData.loggedAt}
                      onChange={(e) => setFormData({ ...formData, loggedAt: e.target.value })}
                      className="input w-full"
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