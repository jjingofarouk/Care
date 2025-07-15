'use client';

import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { emergencyService } from '../../services/emergencyService';

export default function TriagePage() {
  const [triages, setTriages] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    triageLevel: '',
    symptoms: '',
    assessedAt: '',
  });

  useEffect(() => {
    fetchTriages();
  }, []);

  const fetchTriages = async () => {
    const data = await emergencyService.getTriages();
    setTriages(data);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ patientId: '', triageLevel: '', symptoms: '', assessedAt: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await emergencyService.createTriage(formData);
    fetchTriages();
    handleClose();
  };

  const handleDelete = async (id) => {
    await emergencyService.deleteTriage(id);
    fetchTriages();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'patientId', headerName: 'Patient ID', width: 150 },
    { field: 'triageLevel', headerName: 'Triage Level', width: 150 },
    { field: 'symptoms', headerName: 'Symptoms', width: 200 },
    { field: 'assessedAt', headerName: 'Assessed At', width: 200, valueFormatter: ({ value }) => new Date(value).toLocaleString() },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2">
          <a href={`/emergency/triage/${params.row.id}`} className="btn btn-primary">View</a>
          <button onClick={() => handleDelete(params.row.id)} className="btn btn-danger">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Triage Assessments</h2>
      </div>
      <div className="p-6">
        <button onClick={handleOpen} className="btn btn-primary mb-4">Add Triage</button>
        <div className="h-[400px] w-full">
          <DataGrid rows={triages} columns={columns} pageSize={5} />
        </div>
        {open && (
          <div className="fixed inset-0 bg-hospital-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="card max-w-md w-full">
              <div className="card-header">
                <h2 className="card-title">Add Triage</h2>
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
                  placeholder="Triage Level"
                  value={formData.triageLevel}
                  onChange={(e) => setFormData({ ...formData, triageLevel: e.target.value })}
                  className="input w-full"
                />
                <input
                  type="text"
                  placeholder="Symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="input w-full"
                />
                <input
                  type="datetime-local"
                  placeholder="Assessed At"
                  value={formData.assessedAt}
                  onChange={(e) => setFormData({ ...formData, assessedAt: e.target.value })}
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