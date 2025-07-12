// DoctorsPage.jsx
'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DoctorTable from '../components/doctors/DoctorTable';
import DoctorForm from '../components/doctors/DoctorForm';
import ScheduleTable from '../components/doctors/ScheduleTable';
import ScheduleForm from '../components/doctors/ScheduleForm';
import SpecializationTable from '../components/doctors/SpecializationTable';
import SpecializationForm from '../components/doctors/SpecializationForm';
import LeaveTable from '../components/doctors/LeaveTable';
import LeaveForm from '../components/doctors/LeaveForm';
import { getDoctors, createDoctor, deleteDoctor } from '../services/doctorService';
import { getSchedules, createSchedule, deleteSchedule } from '../services/scheduleService';
import { getSpecializations, createSpecialization, deleteSpecialization } from '../services/specializationService';
import { getLeaves, createLeave, deleteLeave } from '../services/leaveService';
import { Tabs, Tab, Box } from '@mui/material';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [openDoctor, setOpenDoctor] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [openSpecialization, setOpenSpecialization] = useState(false);
  const [openLeave, setOpenLeave] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [doctorData, scheduleData, specializationData, leaveData] = await Promise.all([
          getDoctors(),
          getSchedules(),
          getSpecializations(),
          getLeaves()
        ]);
        setDoctors(doctorData || []);
        setSchedules(scheduleData || []);
        setSpecializations(specializationData || []);
        setLeaves(leaveData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDoctorSubmit = async (formData) => {
    try {
      await createDoctor(formData);
      setOpenDoctor(false);
      setSelectedDoctor(null);
      const data = await getDoctors();
      setDoctors(data || []);
    } catch (error) {
      console.error('Error creating doctor:', error);
      setError('Failed to create doctor. Please try again.');
    }
  };

  const handleScheduleSubmit = async (formData) => {
    try {
      await createSchedule(formData);
      setOpenSchedule(false);
      setSelectedSchedule(null);
      const data = await getSchedules();
      setSchedules(data || []);
    } catch (error) {
      console.error('Error creating schedule:', error);
      setError('Failed to create schedule. Please try again.');
    }
  };

  const handleSpecializationSubmit = async (formData) => {
    try {
      await createSpecialization(formData);
      setOpenSpecialization(false);
      setSelectedSpecialization(null);
      const data = await getSpecializations();
      setSpecializations(data || []);
    } catch (error) {
      console.error('Error creating specialization:', error);
      setError('Failed to create specialization. Please try again.');
    }
  };

  const handleLeaveSubmit = async (formData) => {
    try {
      await createLeave(formData);
      setOpenLeave(false);
      setSelectedLeave(null);
      const data = await getLeaves();
      setLeaves(data || []);
    } catch (error) {
      console.error('Error creating leave:', error);
      setError('Failed to create leave. Please try again.');
    }
  };

  const handleDoctorDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await deleteDoctor(id);
      const data = await getDoctors();
      setDoctors(data || []);
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setError('Failed to delete doctor. Please try again.');
    }
  };

  const handleScheduleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await deleteSchedule(id);
      const data = await getSchedules();
      setSchedules(data || []);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      setError('Failed to delete schedule. Please try again.');
    }
  };

  const handleSpecializationDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this specialization?')) return;
    try {
      await deleteSpecialization(id);
      const data = await getSpecializations();
      setSpecializations(data || []);
    } catch (error) {
      console.error('Error deleting specialization:', error);
      setError('Failed to delete specialization. Please try again.');
    }
  };

  const handleLeaveDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave?')) return;
    try {
      await deleteLeave(id);
      const data = await getLeaves();
      setLeaves(data || []);
    } catch (error) {
      console.error('Error deleting leave:', error);
      setError('Failed to delete leave. Please try again.');
    }
  };

  const handleDoctorEdit = (doctor) => {
    router.push(`/doctors/${doctor.id}`);
  };

  const handleScheduleEdit = (schedule) => {
    router.push(`/doctors/schedules/${schedule.id}`);
  };

  const handleSpecializationEdit = (specialization) => {
    router.push(`/doctors/specializations/${specialization.id}`);
  };

  const handleLeaveEdit = (leave) => {
    router.push(`/doctors/leaves/${leave.id}`);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="w-full min-h-screen bg-[var(--hospital-gray-50)]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="card">
          <div className="card-header">
            <h1 className="card-title text-[var(--role-doctor)]">
              Doctors Management
            </h1>
          </div>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="doctor management tabs">
              <Tab label="Doctors" />
              <Tab label="Schedules" />
              <Tab label="Specializations" />
              <Tab label="Leaves" />
            </Tabs>
          </Box>

          <div className="p-4">
            {error && (
              <div className="alert alert-error m-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="loading-spinner" />
              </div>
            ) : (
              <>
                {tabValue === 0 && (
                  <div>
                    <button
                      className="btn btn-primary bg-[var(--role-doctor)] hover:bg-[var(--hospital-accent-dark)] w-full sm:w-auto mb-4"
                      onClick={() => setOpenDoctor(true)}
                    >
                      Add Doctor
                    </button>
                    <DoctorTable
                      doctors={doctors}
                      onEdit={handleDoctorEdit}
                      onDelete={handleDoctorDelete}
                    />
                  </div>
                )}
                {tabValue === 1 && (
                  <div>
                    <button
                      className="btn btn-primary bg-[var(--role-doctor)] hover:bg-[var(--hospital-accent-dark)] w-full sm:w-auto mb-4"
                      onClick={() => setOpenSchedule(true)}
                    >
                      Add Schedule
                    </button>
                    <ScheduleTable
                      schedules={schedules}
                      onEdit={handleScheduleEdit}
                      onDelete={handleScheduleDelete}
                    />
                  </div>
                )}
                {tabValue === 2 && (
                  <div>
                    <button
                      className="btn btn-primary bg-[var(--role-doctor)] hover:bg-[var(--hospital-accent-dark)] w-full sm:w-auto mb-4"
                      onClick={() => setOpenSpecialization(true)}
                    >
                      Add Specialization
                    </button>
                    <SpecializationTable
                      specializations={specializations}
                      onEdit={handleSpecializationEdit}
                      onDelete={handleSpecializationDelete}
                    />
                  </div>
                )}
                {tabValue === 3 && (
                  <div>
                    <button
                      className="btn btn-primary bg-[var(--role-doctor)] hover:bg-[var(--hospital-accent-dark)] w-full sm:w-auto mb-4"
                      onClick={() => setOpenLeave(true)}
                    >
                      Add Leave
                    </button>
                    <LeaveTable
                      leaves={leaves}
                      onEdit={handleLeaveEdit}
                      onDelete={handleLeaveDelete}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Doctor Modal */}
        <div className={`fixed inset-0 bg-[var(--hospital-gray-900)] bg-opacity-50 transition-opacity ${openDoctor ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
             onClick={() => setOpenDoctor(false)}>
          <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--hospital-white)] rounded-lg shadow-xl transition-all duration-300 ${openDoctor ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
               onClick={(e) => e.stopPropagation()}>
            <div className="bg-[var(--hospital-gray-50)] px-6 py-4 rounded-t-lg">
              <h2 className="text-lg font-semibold text-[var(--role-doctor)]">
                Add Doctor
              </h2>
            </div>
            <div className="p-6">
              <DoctorForm
                doctor={selectedDoctor}
                onSubmit={handleDoctorSubmit}
                onCancel={() => setOpenDoctor(false)}
              />
            </div>
          </div>
        </div>

        {/* Schedule Modal */}
        <div className={`fixed inset-0 bg-[var(--hospital-gray-900)] bg-opacity-50 transition-opacity ${openSchedule ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
             onClick={() => setOpenSchedule(false)}>
          <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--hospital-white)] rounded-lg shadow-xl transition-all duration-300 ${openSchedule ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
               onClick={(e) => e.stopPropagation()}>
            <div className="bg-[var(--hospital-gray-50)] px-6 py-4 rounded-t-lg">
              <h2 className="text-lg font-semibold text-[var(--role-doctor)]">
                Add Schedule
              </h2>
            </div>
            <div className="p-6">
              <ScheduleForm
                schedule={selectedSchedule}
                onSubmit={handleScheduleSubmit}
                onCancel={() => setOpenSchedule(false)}
              />
            </div>
          </div>
        </div>

        {/* Specialization Modal */}
        <div className={`fixed inset-0 bg-[var(--hospital-gray-900)] bg-opacity-50 transition-opacity ${openSpecialization ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
             onClick={() => setOpenSpecialization(false)}>
          <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--hospital-white)] rounded-lg shadow-xl transition-all duration-300 ${openSpecialization ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
               onClick={(e) => e.stopPropagation()}>
            <div className="bg-[var(--hospital-gray-50)] px-6 py-4 rounded-t-lg">
              <h2 className="text-lg font-semibold text-[var(--role-doctor)]">
                Add Specialization
              </h2>
            </div>
            <div className="p-6">
              <SpecializationForm
                specialization={selectedSpecialization}
                onSubmit={handleSpecializationSubmit}
                onCancel={() => setOpenSpecialization(false)}
              />
            </div>
          </div>
        </div>

        {/* Leave Modal */}
        <div className={`fixed inset-0 bg-[var(--hospital-gray-900)] bg-opacity-50 transition-opacity ${openLeave ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
             onClick={() => setOpenLeave(false)}>
          <div className=`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--hospital-white)] rounded-lg shadow-xl transition-all duration-300 ${openLeave ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
               onClick={(e) => e.stopPropagation()}>
            <div className="bg-[var(--hospital-gray-50)] px-6 py-4 rounded-t-lg">
              <h2 className="text-lg font-semibold text-[var(--role-doctor)]">
                Add Leave
              </h2>
            </div>
            <div className="p-6">
              <LeaveForm
                leave={selectedLeave}
                onSubmit={handleLeaveSubmit}
                onCancel={() => setOpenLeave(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}