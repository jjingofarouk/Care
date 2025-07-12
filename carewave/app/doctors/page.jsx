'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DoctorTable from '../components/doctors/DoctorTable';
import DoctorForm from '../components/doctors/DoctorForm';
import { getDoctors, createDoctor, deleteDoctor } from '../services/doctorService';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      const data = await getDoctors();
      setDoctors(data);
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (formData) => {
    await createDoctor(formData);
    setOpen(false);
    setSelectedDoctor(null);
    const data = await getDoctors();
    setDoctors(data);
  };

  const handleDelete = async (id) => {
    await deleteDoctor(id);
    const data = await getDoctors();
    setDoctors(data);
  };

  const handleEdit = (doctor) => {
    router.push(`/doctors/${doctor.id}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="card bg-[var(--hospital-white)] shadow-md rounded-lg">
        <div className="card-header p-4 border-b border-[var(--hospital-gray-200)]">
          <div className="flex justify-between items-center">
            <h1 className="card-title text-2xl font-bold text-[var(--hospital-primary)]">Doctors Management</h1>
            <Button
              variant="contained"
              className="btn btn-primary bg-[var(--hospital-accent)] hover:bg-[var(--hospital-accent-dark)]"
              onClick={() => setOpen(true)}
            >
              Add Doctor
            </Button>
          </div>
        </div>
        <div className="p-4">
          <DoctorTable
            doctors={doctors}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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