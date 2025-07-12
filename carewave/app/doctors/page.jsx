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
    <div className="min-h-screen w-full bg-gray-50">
      <div className="mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-lg bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h1 className="text-2xl font-semibold text-blue-700">
                Doctors Management
              </h1>
              <button
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors sm:w-auto"
                onClick={() => setOpen(true)}
              >
                Add Doctor
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mx-4 my-2 rounded-md bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}
          
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-gray-200 border-t-blue-500" />
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

        <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
             onClick={() => setOpen(false)}>
          <div className={`fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-xl transition-all duration-300 ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
               onClick={(e) => e.stopPropagation()}>
            <div className="rounded-t-lg bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-semibold text-blue-700">
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