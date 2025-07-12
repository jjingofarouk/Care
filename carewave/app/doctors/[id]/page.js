'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DoctorForm from '../../components/doctors/DoctorForm';
import { getDoctor, updateDoctor, deleteDoctor } from '@/services/doctorService';

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
    <div className="w-full min-h-screen bg-[var(--hospital-gray-50)]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="card">
          <div className="card-header">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="card-title text-[var(--role-doctor)]">Edit Doctor</h1>
              <button
                className="btn btn-danger w-full sm:w-auto"
                onClick={handleDelete}
              >
                Delete Doctor
              </button>
            </div>
          </div>
          {doctor && (
            <div className={`fixed inset-0 bg-[var(--hospital-gray-900)] bg-opacity-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                 onClick={() => router.push('/doctors')}>
              <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--hospital-white)] rounded-lg shadow-xl transition-all duration-300 ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                   onClick={(e) => e.stopPropagation()}>
                <div className="bg-[var(--hospital-gray-50)] px-6 py-4 rounded-t-lg">
                  <h2 className="text-lg font-semibold text-[var(--role-doctor)]">
                    Edit Doctor
                  </h2>
                </div>
                <div className="p-6">
                  <DoctorForm
                    doctor={doctor}
                    onSubmit={handleSubmit}
                    onCancel={() => router.push('/doctors')}
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