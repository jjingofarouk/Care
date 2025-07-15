// app/doctors/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DoctorTable from '../components/doctors/DoctorTable';
import DoctorForm from '../components/doctors/DoctorForm';
import { getDoctors, createDoctor, deleteDoctor } from '../services/doctorService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
        setDoctors(data || []);
      } catch (error) {
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
      setLoading(true);
      await createDoctor(formData);
      setOpen(false);
      setSelectedDoctor(null);
      const data = await getDoctors();
      setDoctors(data || []);
    } catch (error) {
      setError('Failed to create doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteDoctor(id);
      const data = await getDoctors();
      setDoctors(data || []);
    } catch (error) {
      setError('Failed to delete doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor) => {
    router.push(`/doctors/${doctor.id}`);
  };

  return (
    <div className="card w-full max-w-[100vw] mx-0 p-0">
      <div className="card-header px-2 py-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="card-title text-lg">
            {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Doctors Management'}
          </h2>
          {loading ? (
            <Skeleton width={150} height={36} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          ) : (
            <button
              className="btn btn-primary mb-2"
              onClick={() => setOpen(true)}
            >
              Add Doctor
            </button>
          )}
        </div>
      </div>
      <div className="p-2">
        {error && (
          <div className="alert alert-error mb-2">
            {loading ? <Skeleton width={300} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : error}
          </div>
        )}
        {loading ? (
          <Skeleton count={5} height={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
        ) : (
          <DoctorTable
            doctors={doctors}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {open && (
          <div className="fixed inset-0 bg-hospital-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="card max-w-md w-full mx-2 p-0">
              <div className="card-header px-2 py-1">
                <h2 className="card-title text-lg">
                  {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Add Doctor'}
                </h2>
              </div>
              <div className="p-2">
                {loading ? (
                  <>
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton width={100} height={36} count={2} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                  </>
                ) : (
                  <DoctorForm
                    doctor={selectedDoctor}
                    onSubmit={handleSubmit}
                    onCancel={() => setOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}