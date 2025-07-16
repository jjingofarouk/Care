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
    patientId: '',
    vaccineId: '',
    immunizationScheduleId: '',
    administeredDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [vaccines, setVaccines] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVaccinations();
    fetchVaccines();
    fetchSchedules();
  }, []);

  const fetchVaccinations = async () => {
    try {
      setLoading(true);
      const data = await vaccinationService.getVaccinations();
      setVaccinations(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch vaccinations');
      console.error('Error fetching vaccinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVaccines = async () => {
    try {
      const data = await vaccinationService.getVaccines();
      setVaccines(data);
    } catch (err) {
      console.error('Error fetching vaccines:', err);
    }
  };

  const fetchSchedules = async () => {
    try {
      const data = await vaccinationService.getSchedules();
      setSchedules(data);
    } catch (err) {
      console.error('Error fetching schedules:', err);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ patientId: '', vaccineId: '', immunizationScheduleId: '', administeredDate: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await vaccinationService.createVaccination(formData);
      await fetchVaccinations();
      handleClose();
      setError('');
    } catch (err) {
      setError('Failed to create vaccination record');
      console.error('Error creating vaccination:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await vaccinationService.deleteVaccination(id);
      await fetchVaccinations();
      setError('');
    } catch (err) {
      setError('Failed to delete vaccination record');
      console.error('Error deleting vaccination:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'patientId', headerName: 'Patient ID', width: 150 },
    {
      field: 'vaccineId',
      headerName: 'Vaccine',
      width: 200,
      valueGetter: (value, row) => row.vaccine?.name || 'Unknown',
    },
    {
      field: 'immunizationScheduleId',
      headerName: 'Schedule',
      width: 200,
      valueGetter: (value, row) => row.immunizationSchedule?.name || 'None',
    },
    {
      field: 'administeredDate',
      headerName: 'Administered Date',
      width: 200,
      valueGetter: (value, row) => new Date(row.administeredDate).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <a 
            href={`/vaccination/${params.row.id}`} 
            style={{
              padding: '4px 8px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            View
          </a>
          <button 
            onClick={() => handleDelete(params.row.id)} 
            style={{
              padding: '4px 8px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100vw', margin: 0, padding: 0 }}>
      <div style={{ padding: '8px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
          {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Vaccination Records'}
        </h2>
      </div>
      <div style={{ padding: '8px' }}>
        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '8px', 
            borderRadius: '4px', 
            marginBottom: '8px' 
          }}>
            {error}
          </div>
        )}
        {loading ? (
          <Skeleton width={150} height={36} baseColor="#e5e7eb" highlightColor="#f3f4f6" style={{ marginBottom: '8px' }} />
        ) : (
          <button 
            onClick={handleOpen} 
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '8px'
            }}
          >
            Add Vaccination Record
          </button>
        )}
        <div style={{ height: '400px', width: '100%' }}>
          {loading ? (
            <Skeleton count={5} height={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          ) : (
            <DataGrid
              rows={vaccinations}
              columns={columns}
              initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
            />
          )}
        </div>
        {open && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              maxWidth: '400px',
              width: '100%',
              margin: '8px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f8f9fa', 
                borderBottom: '1px solid #dee2e6',
                borderRadius: '8px 8px 0 0'
              }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                  {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Add Vaccination Record'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: '16px' }}>
                {loading ? (
                  <>
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" style={{ marginBottom: '8px' }} />
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" style={{ marginBottom: '8px' }} />
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" style={{ marginBottom: '8px' }} />
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" style={{ marginBottom: '8px' }} />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Patient ID"
                      value={formData.patientId}
                      onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        marginBottom: '8px'
                      }}
                      required
                    />
                    <select
                      value={formData.vaccineId}
                      onChange={(e) => setFormData({ ...formData, vaccineId: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        marginBottom: '8px'
                      }}
                      required
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
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        marginBottom: '8px'
                      }}
                    >
                      <option value="">Select Schedule (Optional)</option>
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
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        marginBottom: '16px'
                      }}
                      required
                    />
                  </>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  {loading ? (
                    <Skeleton width={100} height={36} count={2} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                  ) : (
                    <>
                      <button 
                        type="button" 
                        onClick={handleClose}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#6c757d',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Save
                      </button>
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