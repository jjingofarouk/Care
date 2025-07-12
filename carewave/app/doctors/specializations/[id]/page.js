'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SpecializationForm from '../../../components/doctors/SpecializationForm';
import { getSpecialization, updateSpecialization, deleteSpecialization } from '../../../services/doctorService';

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
    <div className="w-full min-h-screen bg-[var(--hospital-gray-50)]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="card">
          <div className="card-header">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="card-title text-[var(--role-doctor)]">Edit Specialization</h1>
              <button
                className="btn btn-danger w-full sm:w-auto"
                onClick={handleDelete}
              >
                Delete Specialization
              </button>
            </div>
          </div>
          {specialization && (
            <div className={`fixed inset-0 bg-[var(--hospital-gray-900)] bg-opacity-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                 onClick={() => router.push('/doctors/specializations')}>
              <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--hospital-white)] rounded-lg shadow-xl transition-all duration-300 ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                   onClick={(e) => e.stopPropagation()}>
                <div className="bg-[var(--hospital-gray-50)] px-6 py-4 rounded-t-lg">
                  <h2 className="text-lg font-semibold text-[var(--role-doctor)]">
                    Edit Specialization
                  </h2>
                </div>
                <div className="p-6">
                  <SpecializationForm
                    specialization={specialization}
                    onSubmit={handleSubmit}
                    onCancel={() => router.push('/doctors/specializations')}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}