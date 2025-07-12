'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import ScheduleTable from '../../components/doctors/ScheduleTable';
import ScheduleForm from '../../components/doctors/ScheduleForm';
import { getSchedules, createSchedule, deleteSchedule, getDoctors } from '../../services/doctorService';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

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
    <div className="container mx-auto p-6">
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h1 className="card-title">Doctor Schedules</h1>
            <Button
              variant="contained"
              className="btn btn-primary"
              onClick={() => setOpen(true)}
            >
              Add Schedule
            </Button>
          </div>
        </div>
        <ScheduleTable
          schedules={schedules}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{selectedSchedule ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>
        <DialogContent>
          <ScheduleForm
            schedule={selectedSchedule}
            doctors={doctors}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}