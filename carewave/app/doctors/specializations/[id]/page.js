'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SpecializationForm from '../../../components/doctors/SpecializationForm';
import { getSpecialization, updateSpecialization, deleteSpecialization } from '../../../services/doctorService';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

export default function SpecializationEditPage() {
  const [specialization, setSpecialization] = useState(null);
  const [open, setOpen] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchSpecialization = async () => {
      const data = await getSpecialization(id);
      setSpecialization(data);
    };
    fetchSpecialization();
  }, [id]);

  const handleSubmit = async (formData) => {
    await updateSpecialization(id, formData);
    setOpen(false);
    router.push('/doctors/specializations');
  };

  const handleDelete = async () => {
    await deleteSpecialization(id);
    router.push('/doctors/specializations');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h1 className="card-title">Edit Specialization</h1>
            <Button
              variant="contained"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete Specialization
            </Button>
          </div>
        </div>
        {specialization && (
          <Dialog open={open} onClose={() => router.push('/doctors/specializations')}>
            <DialogTitle>Edit Specialization</DialogTitle>
            <DialogContent>
              <SpecializationForm
                specialization={specialization}
                onSubmit={handleSubmit}
                onCancel={() => router.push('/doctors/specializations')}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}