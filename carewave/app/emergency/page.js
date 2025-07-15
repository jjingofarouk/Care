'use client';

import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { emergencyService } from '../services/emergencyService';

export default function EmergencyPage() {
  const [emergencies, setEmergencies] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    triageId: '',
    admissionId: '',
  });

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const fetchEmergencies = async () => {
    const data = await emergencyService.getEmergencies();
    setEmergencies(data);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ patientId: '', triageId: '', admissionId: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await emergencyService.createEmergency(formData);
    fetchEmergencies();
    handleClose();
  };

  const handleDelete = async (id) => {
    await emergencyService.deleteEmergency(id);
    fetchEmergencies();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'patientId', headerName: 'Patient ID', width: 150 },
    { field: 'triageId', headerName: 'Triage ID', width: 150 },
    { field: 'admissionId', headerName: 'Admission ID', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2">
          <a href={`/emergency/${params.row.id}`} className="btn btn-primary">View</a>
          <button onClick={() => handleDelete(params.row.id)} className="btn btn-danger">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Emergency Cases</h2>
      </div>
      <div className="p-6">
        <button onClick={handleOpen} className="btn btn-primary mb-4">Add Emergency Case</button>
        <div className="h-[400px] w-full">
          <DataGrid rows={emergencies} columns={columns} pageSize={5} />
        </div>
        {open && (
          <div className="fixed inset-0 bg-hospital-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="card max-w-md w-full">
              <div className="card-header">
                <h2 className="card-title">Add Emergency Case</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Patient ID"
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="input w-full"
                />
                <input
                  type="text"
                  placeholder="Triage ID"
                  value={formData.triageId}
                  onChange={(e) => setFormData({ ...formData, triageId: e.target.value })}
                  className="input w-full"
                />
                <input
                  type="text"
                  placeholder="Admission ID"
                  value={formData.admissionId}
                  onChange={(e) => setFormData({ ...formData, admissionId: e.target.value })}
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