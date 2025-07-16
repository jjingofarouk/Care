// app/vaccination/[id]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { vaccinationService } from '../../services/vaccinationService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function VaccinationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [vaccination, setVaccination] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    vaccineId: '',
    immunizationScheduleId: '',
    administeredDate: '',
  });
  const [vaccines, setVaccines] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchVaccination();
      fetchVaccines();
      fetchSchedules();
    }
  }, [id]);

  const fetchVaccination = async () => {
    try {
      setLoading(true);
      const data = await vaccinationService.getVaccination(id);
      setVaccination(data);
      setFormData({
        patientId: data.patientId,
        vaccineId: data.vaccineId,
        immunizationScheduleId: data.immunizationScheduleId || '',
        administeredDate: new Date(data.administeredDate).toISOString().split('T')[0],
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch vaccination record');
      console.error('Error fetching vaccination:', err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await vaccinationService.updateVaccination(id, formData);
      await fetchVaccination();
      setError('');
      // Show success message or redirect
    } catch (err) {
      setError('Failed to update vaccination record');
      console.error('Error updating vaccination:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (vaccination) {
      setFormData({
        patientId: vaccination.patientId,
        vaccineId: vaccination.vaccineId,
        immunizationScheduleId: vaccination.immunizationScheduleId || '',
        administeredDate: new Date(vaccination.administeredDate).toISOString().split('T')[0],
      });
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <Skeleton height={400} width={800} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
      </div>
    );
  }

  if (!vaccination) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#dc3545', marginBottom: '16px' }}>Vaccination Record Not Found</h2>
          <button 
            onClick={() => router.push('/vaccination')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back to Vaccination Records
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa', 
      padding: '32px 16px' 
    }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '24px', 
            backgroundColor: '#f8f9fa', 
            borderBottom: '1px solid #dee2e6' 
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: 'bold',
              color: '#495057'
            }}>
              Vaccination Record Details
            </h2>
            <p style={{ 
              margin: '4px 0 0 0', 
              color: '#6c757d' 
            }}>
              Record #{vaccination.id}
            </p>
          </div>
          
          <div style={{ padding: '24px' }}>
            {error && (
              <div style={{ 
                backgroundColor: '#f8d7da', 
                color: '#721c24', 
                padding: '12px', 
                borderRadius: '4px', 
                marginBottom: '24px' 
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '24px', 
                marginBottom: '24px' 
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    color: '#495057'
                  }}>
                    Patient ID
                  </label>
                  <input
                    type="text"
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    placeholder="Enter Patient ID"
                    required
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    color: '#495057'
                  }}>
                    Vaccine
                  </label>
                  <select
                    value={formData.vaccineId}
                    onChange={(e) => setFormData({ ...formData, vaccineId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '14px'
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
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    color: '#495057'
                  }}>
                    Immunization Schedule
                  </label>
                  <select
                    value={formData.immunizationScheduleId}
                    onChange={(e) => setFormData({ ...formData, immunizationScheduleId: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select Schedule (Optional)</option>
                    {schedules.map((schedule) => (
                      <option key={schedule.id} value={schedule.id}>
                        {schedule.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '14px', 
                    fontWeight: '500',
                    color: '#495057'
                  }}>
                    Administered Date
                  </label>
                  <input
                    type="date"
                    value={formData.administeredDate}
                    onChange={(e) => setFormData({ ...formData, administeredDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  disabled={isSubmitting}
                >
                  Reset
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Record'}
                </button>
              </div>
            </form>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '32px' 
            }}>
              <div>
                <h3 style={{ 
                  marginBottom: '16px', 
                  fontSize: '18px', 
                  fontWeight: '600',
                  color: '#495057'
                }}>
                  Vaccine Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontWeight: '500', color: '#6c757d' }}>Name:</span>
                    <span>{vaccination.vaccine?.name || 'Unknown'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: '500', color: '#6c757d' }}>Description:</span>
                    <span>{vaccination.vaccine?.description || 'No description'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ 
                  marginBottom: '16px', 
                  fontSize: '18px', 
                  fontWeight: '600',
                  color: '#495057'
                }}>
                  Schedule Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontWeight: '500', color: '#6c757d' }}>Name:</span>
                    <span>{vaccination.immunizationSchedule?.name || 'None'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: '500', color: '#6c757d' }}>Description:</span>
                    <span>{vaccination.immunizationSchedule?.description || 'No description'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}