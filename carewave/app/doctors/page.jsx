// app/doctors/page.jsx
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
    <div className="min-h-screen w-full bg-[var(--hospital-gray-50)]">
      <div className="mx-auto w-full max-w-[1920px] px-2 sm:px-4 lg:px-6 py-2">
        <div className="card">
          <div className="card-header">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
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
            <div className="alert alert-error m-2">
              {error}
            </div>
          )}
          
          <div className="p-2">
            {loading ? (
              <div className="flex items-center justify-center p-4">
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
          <div className={`fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[var(--hospital-white)] shadow-xl transition-all duration-[var(--transition-normal)] ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
               onClick={(e) => e.stopPropagation()}>
            <div className="rounded-t-lg bg-[var(--hospital-gray-50)] px-4 py-2">
              <h2 className="text-base font-semibold text-[var(--role-doctor)]">
                Add Doctor
              </h2>
            </div>
            <div className="p-4">
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