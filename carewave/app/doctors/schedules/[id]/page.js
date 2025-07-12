'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ScheduleForm from '../../../components/doctors/ScheduleForm';
import { getSchedule, updateSchedule, deleteSchedule, getDoctors } from '@/services/doctorService';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

export default function ScheduleEditPage() {
  const [schedule, setSchedule] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchData = async () => {
      const scheduleData = await getSchedule(id);
      const doctorsData = await getDoctors();
      setSchedule(scheduleData);
      setDoctors(doctorsData);
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (formData) => {
    await updateSchedule(id, formData);
    setOpen(false);
    router.push('/doctors/schedules');
  };

  const handleDelete = async () => {
    await deleteSchedule(id);
    router.push('/doctors/schedules');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h1 className="card-title">Edit Schedule</h1>
            <Button
              variant="contained"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete Schedule
            </Button>
          </div>
        </div>
        {schedule && (
          <Dialog open={open} onClose={() => router.push('/doctors/schedules')}>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogContent>
              <ScheduleForm
                schedule={schedule}
                doctors={doctors}
                onSubmit={handleSubmit}
                onCancel={() => router.push('/doctors/schedules')}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}