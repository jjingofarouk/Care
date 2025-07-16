// app/vaccination/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { vaccinationService } from '../services/vaccinationService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function VaccinationPage() {
  const [vaccinations, setVaccinations] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    patientId: '',
    vaccineId: '',
    immunizationScheduleId: '',
    administeredDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [vaccines, setVaccines] = useState([]);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchVaccinations();
    fetchVaccines();
    fetchSchedules();
  }, []);

  const fetchVaccinations = async () => {
    setLoading(true);
    const data = await vaccinationService.getVaccinations();
    setVaccinations(data);
    setLoading(false);
  };

  const fetchVaccines = async () => {
    const data = await vaccinationService.getVaccines();
    setVaccines(data);
  };

  const fetchSchedules = async () => {
    const data = await vaccinationService.getSchedules();
    setSchedules(data);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ id: '', patientId: '', vaccineId: '', immunizationScheduleId: '', administeredDate: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await vaccinationService.createVaccination(formData);
    await fetchVaccinations();
    handleClose();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await vaccinationService.deleteVaccination(id);
    await fetchVaccinations();
    setLoading(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'patientId', headerName: 'Patient ID', width: 150 },
    {
      field: 'vaccineId',
      headerName: 'Vaccine',
      width: 200,
      valueGetter: (params) => params.row.vaccine?.name || 'Unknown',
    },
    {
      field: 'immunizationScheduleId',
      headerName: 'Schedule',
      width: 200,
      valueGetter: (params) => params.row.immunizationSchedule?.name || 'None',
    },
    {
      field: 'administeredDate',
      headerName: 'Administered Date',
      width: 200,
      valueGetter: (params) => new Date(params.row.administeredDate).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2">
          <a href={`/vaccination/${params.row.id}`} className="btn btn-primary">View</a>
          <button onClick={() => handleDelete(params.row.id)} className="btn btn-danger">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="card w-full max-w-[100vw] mx-0 p-0">
      <div className="card-header px-2 py-1">
        <h2 className="card-title text-lg">
          {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Vaccination Records'}
        </h2>
      </div>
      <div className="p-2">
        {loading ? (
          <Skeleton width={150} height={36} baseColor="#e5e7eb" highlightColor="#f3f4f6" className="mb-2" />
        ) : (
          <button onClick={handleOpen} className="btn btn-primary mb-2">Add Vaccination Record</button>
        )}
        <div className="h-[400px] w-full">
          {loading ? (
            <Skeleton count={5} height={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          ) : (
            <DataGrid
              rows={vaccinations}
              columns={columns}
              initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
              pageSizeOptions={[5, 10, 25]}
            />
          )}
        </div>
        {open && (
          <div className="fixed inset-0 bg-hospital-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="card max-w-md w-full mx-2 p-0">
              <div className="card-header px-2 py-1">
                <h2 className="card-title text-lg">
                  {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Add Vaccination Record'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-2 space-y-2">
                {loading ? (
                  <>
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Record ID (5 digits)"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className="input w-full"
                    />
                    <input
                      type="text"
                      placeholder="Patient ID"
                      value={formData.patientId}
                      onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                      className="input w-full"
                    />
                    <select
                      value={formData.vaccineId}
                      onChange={(e) => setFormData({ ...formData, vaccineId: e.target.value })}
                      className="input w-full"
                    >
                      <option value="">Select Vaccine</option>
                      {vaccines.map((vaccine) => (
                        <option key={vaccine.id} value={vaccine.id}>
                          {vaccine.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={formData.immunizationScheduleId}
                      onChange={(e) => setFormData({ ...formData, immunizationScheduleId: e.target.value })}
                      className="input w-full"
                    >
                      <option value="">Select Schedule</option>
                      {schedules.map((schedule) => (
                        <option key={schedule.id} value={schedule.id}>
                          {schedule.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={formData.administeredDate}
                      onChange={(e) => setFormData({ ...formData, administeredDate: e.target.value })}
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
