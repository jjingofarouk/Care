'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DoctorForm from '../../components/doctors/DoctorForm';
import { getDoctor, updateDoctor, deleteDoctor } from '@/services/doctorService';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

export default function DoctorEditPage() {
  const [doctor, setDoctor] = useState(null);
  const [open, setOpen] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchDoctor = async () => {
      const data = await getDoctor(id);
      setDoctor(data);
    };
    fetchDoctor();
  }, [id]);

  const handleSubmit = async (formData) => {
    await updateDoctor(id, formData);
    setOpen(false);
    router.push('/doctors');
  };

  const handleDelete = async () => {
    await deleteDoctor(id);
    router.push('/doctors');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h1 className="card-title">Edit Doctor</h1>
            <Button
              variant="contained"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete Doctor
            </Button>
          </div>
        </div>
        {doctor && (
          <Dialog open={open} onClose={() => router.push('/doctors')}>
            <DialogTitle>Edit Doctor</DialogTitle>
            <DialogContent>
              <DoctorForm
                doctor={doctor}
                onSubmit={handleSubmit}
                onCancel={() => router.push('/doctors')}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}