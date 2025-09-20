'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import ScheduleTable from '../../components/doctors/ScheduleTable';
import ScheduleForm from '../../components/doctors/ScheduleForm';
import { getSchedules, createSchedule, deleteSchedule, getDoctors } from '../../services/doctorService';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const scheduleData = await getSchedules();
      const doctorsData = await getDoctors();
      setSchedules(scheduleData);
      setDoctors(doctorsData);
    };
    fetchData();
  }, []);

  const handleSubmit = async (formData) => {
    await createSchedule(formData);
    setOpen(false);
    setSelectedSchedule(null);
    const data = await getSchedules();
    setSchedules(data);
  };

  const handleDelete = async (id) => {
    await deleteSchedule(id);
    const data = await getSchedules();
    setSchedules(data);
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[var(--hospital-gray-50)]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="card">
          <div className="card-header">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="card-title text-[var(--role-doctor)]">Doctor Schedules</h1>
              <button
                className="btn btn-primary bg-[var(--role-doctor)] hover:bg-[var(--hospital-accent-dark)] w-full sm:w-auto"
                onClick={() => setOpen(true)}
              >
                Add Schedule
              </button>
            </div>
          </div>
          <div className="p-4">
            <ScheduleTable
              schedules={schedules}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>

        <div className={`fixed inset-0 bg-[var(--hospital-gray-900)] bg-opacity-50 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
             onClick={() => setOpen(false)}>
          <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--hospital-white)] rounded-lg shadow-xl transition-all duration-300 ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
               onClick={(e) => e.stopPropagation()}>
            <div className="bg-[var(--hospital-gray-50)] px-6 py-4 rounded-t-lg">
              <h2 className="text-lg font-semibold text-[var(--role-doctor)]">
                {selectedSchedule ? 'Edit Schedule' : 'Add Schedule'}
              </h2>
            </div>
            <div className="p-6">
              <ScheduleForm
                schedule={selectedSchedule}
                doctors={doctors}
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