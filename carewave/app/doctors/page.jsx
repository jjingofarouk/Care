'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DoctorTable from '../components/doctors/DoctorTable';
import DoctorForm from '../components/doctors/DoctorForm';
import { getDoctors, createDoctor, deleteDoctor } from '../services/doctorService';
import { Button, Dialog, DialogTitle, DialogContent, Alert } from '@mui/material';

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
        console.log('Fetched doctors:', data); // Debug log
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
      
      // Refresh the doctors list
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
      // Refresh the doctors list
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
    <div className="container mx-auto p-6">
      <div className="card bg-[var(--hospital-white)] shadow-md rounded-lg">
        <div className="card-header p-4 border-b border-[var(--hospital-gray-200)]">
          <div className="flex justify-between items-center">
            <h1 className="card-title text-2xl font-bold text-[var(--hospital-primary)]">
              Doctors Management
            </h1>
            <Button
              variant="contained"
              className="btn btn-primary bg-[var(--hospital-accent)] hover:bg-[var(--hospital-accent-dark)]"
              onClick={() => setOpen(true)}
            >
              Add Doctor
            </Button>
          </div>
        </div>
        
        {error && (
          <Alert severity="error" className="m-4">
            {error}
          </Alert>
        )}
        
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <p>Loading doctors...</p>
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

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="bg-[var(--hospital-gray-50)] text-[var(--hospital-primary)]">
          Add Doctor
        </DialogTitle>
        <DialogContent className="p-6">
          <DoctorForm
            doctor={selectedDoctor}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}