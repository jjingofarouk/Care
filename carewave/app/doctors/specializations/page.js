'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import SpecializationTable from '../../components/doctors/SpecializationTable';
import SpecializationForm from '../../components/doctors/SpecializationForm';
import { getSpecializations, createSpecialization, deleteSpecialization } from '../../services/doctorService';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

export default function SpecializationsPage() {
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSpecializations = async () => {
      const data = await getSpecializations();
      setSpecializations(data);
    };
    fetchSpecializations();
  }, []);

  const handleSubmit = async (formData) => {
    await createSpecialization(formData);
    setOpen(false);
    setSelectedSpecialization(null);
    const data = await getSpecializations();
    setSpecializations(data);
  };

  const handleDelete = async (id) => {
    await deleteSpecialization(id);
    const data = await getSpecializations();
    setSpecializations(data);
  };

  const handleEdit = (specialization) => {
    setSelectedSpecialization(specialization);
    setOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h1 className="card-title">Specializations Management</h1>
            <Button
              variant="contained"
              className="btn btn-primary"
              onClick={() => setOpen(true)}
            >
              Add Specialization
            </Button>
          </div>
        </div>
        <SpecializationTable
          specializations={specializations}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{selectedSpecialization ? 'Edit Specialization' : 'Add Specialization'}</DialogTitle>
        <DialogContent>
          <SpecializationForm
            specialization={selectedSpecialization}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}