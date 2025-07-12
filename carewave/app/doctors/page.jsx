'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DoctorTable from '../components/doctors/DoctorTable';
import DoctorForm from '../components/doctors/DoctorForm';
import { getDoctors, createDoctor, deleteDoctor } from '../services/doctorService';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDoctors();
        console.log('Fetched doctors:', data);
        setDoctors(data || []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors. Please try again.');
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      await createDoctor(formData);
      setOpen(false);
      setSelectedDoctor(null);
      
      const data = await getDoctors();
      setDoctors(data || []);
    } catch (error) {
      console.error('Error creating doctor:', error);
      setError('Failed to create doctor. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }
    
    try {
      await deleteDoctor(id);
      const data = await getDoctors();
      setDoctors(data || []);
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setError('Failed to delete doctor. Please try again.');
    }
  };

  const handleEdit = (doctor) => {
    router.push(`/doctors/${doctor.id}`);
  };

  return (
    <div className="w-full min-h-screen bg-[var(--hospital-gray-50)]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="card">
          <div className="card-header">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="card-title text-[var(--role-doctor)]">
                Doctors Management
              </h1>
              <button
                className="btn btn-primary bg-[var(--role-doctor)] hover:bg-[var(--hospital-accent-dark)] w-full sm:w-auto"
                onClick={() => setOpen(true)}
              >
                Add Doctor
              </button>
            </div>
          </div>
          
          {error && (
            <div className="alert alert-error m-4">
              {error}
            </div>
          )}
          
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="loading-spinner" />
              </div>
            ) : (
              <DoctorTable
                doctors={doctors}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>

        <div className={`fixed inset-0 bg-[var(--hospital-gray-900)] bg-opacity-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
             onClick={() => setOpen(false)}>
          <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--hospital-white)] rounded-lg shadow-xl transition-all duration-300 ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
               onClick={(e) => e.stopPropagation()}>
            <div className="bg-[var(--hospital-gray-50)] px-6 py-4 rounded-t-lg">
              <h2 className="text-lg font-semibold text-[var(--role-doctor)]">
                Add Doctor
              </h2>
            </div>
            <div className="p-6">
              <DoctorForm
                doctor={selectedDoctor}
                onSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}