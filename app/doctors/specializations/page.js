// app/doctors/specializations/page.jsx
'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { PrismaClient } from '@prisma/client';
import SpecializationTable from '../../components/doctors/SpecializationTable';
import SpecializationForm from '../../components/doctors/SpecializationForm';

const prisma = new PrismaClient();

export default function SpecializationsPage() {
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await prisma.specialization.findMany({
          include: {
            doctors: {
              include: {
                doctor: true,
              },
            },
          },
          cacheStrategy: { ttl: 60, swr: 60 },
        });
        console.log('Fetched specializations:', data);
        setSpecializations(data || []);
      } catch (error) {
        console.error('Error fetching specializations:', error);
        setError('Failed to load specializations. Please try again.');
        setSpecializations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecializations();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      if (selectedSpecialization) {
        await prisma.specialization.update({
          where: { id: selectedSpecialization.id },
          data: {
            name: formData.name,
            description: formData.description,
          },
        });
      } else {
        await prisma.specialization.create({
          data: {
            name: formData.name,
            description: formData.description,
          },
        });
      }
      setOpen(false);
      setSelectedSpecialization(null);
      const data = await prisma.specialization.findMany({
        include: {
          doctors: {
            include: {
              doctor: true,
            },
          },
        },
        cacheStrategy: { ttl: 60, swr: 60 },
      });
      setSpecializations(data || []);
    } catch (error) {
      console.error('Error saving specialization:', error);
      setError('Failed to save specialization. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this specialization?')) {
      return;
    }
    
    try {
      await prisma.specialization.delete({
        where: { id },
      });
      const data = await prisma.specialization.findMany({
        include: {
          doctors: {
            include: {
              doctor: true,
            },
          },
        },
        cacheStrategy: { ttl: 60, swr: 60 },
      });
      setSpecializations(data || []);
    } catch (error) {
      console.error('Error deleting specialization:', error);
      setError('Failed to delete specialization. Please try again.');
    }
  };

  const handleEdit = (specialization) => {
    setSelectedSpecialization(specialization);
    setOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-[var(--hospital-gray-50)]">
      <div className="mx-auto w-full max-w-[1920px] px-2 sm:px-4">
        <div className="card">
          <div className="card-header">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <h1 className="card-title text-[var(--role-doctor)]">
                Specializations Management
              </h1>
              <button
                className="btn btn-primary bg-[var(--role-doctor)] w-full sm:w-auto"
                onClick={() => {
                  setSelectedSpecialization(null);
                  setOpen(true);
                }}
              >
                Add Specialization
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
              <div className="flex items-center justify-center p-2">
                <div className="loading-spinner" />
              </div>
            ) : (
              <SpecializationTable
                specializations={specializations}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>

        <div className={`fixed inset-0 bg-[var(--hospital-gray-900)] bg-opacity-50 transition-opacity duration-[var(--transition-normal)] ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
             onClick={() => setOpen(false)}>
          <div className={`fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[var(--hospital-white)] shadow-xl transition-all duration-[var(--transition-normal)] ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
               onClick={(e) => e.stopPropagation()}>
            <div className="rounded-t-lg bg-[var(--hospital-gray-50)] px-4 py-2">
              <h2 className="text-base font-semibold text-[var(--role-doctor)]">
                {selectedSpecialization ? 'Edit Specialization' : 'Add Specialization'}
              </h2>
            </div>
            <div className="p-4">
              <SpecializationForm
                specialization={selectedSpecialization}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setSelectedSpecialization(null);
                  setOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}