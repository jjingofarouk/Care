'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import LeaveTable from '../../components/doctors/LeaveTable';
import LeaveForm from '../../components/doctors/LeaveForm';
import { getLeaves, createLeave, deleteLeave, getDoctors } from '../../services/doctorService';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

export default function LeavesPage() {
  const [leaves, setLeaves] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const leaveData = await getLeaves();
      const doctorsData = await getDoctors();
      setLeaves(leaveData);
      setDoctors(doctorsData);
    };
    fetchData();
  }, []);

  const handleSubmit = async (formData) => {
    await createLeave(formData);
    setOpen(false);
    setSelectedLeave(null);
    const data = await getLeaves();
    setLeaves(data);
  };

  const handleDelete = async (id) => {
    await deleteLeave(id);
    const data = await getLeaves();
    setLeaves(data);
  };

  const handleEdit = (leave) => {
    setSelectedLeave(leave);
    setOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h1 className="card-title">Doctor Leaves</h1>
            <Button
              variant="contained"
              className="btn btn-primary"
              onClick={() => setOpen(true)}
            >
              Add Leave
            </Button>
          </div>
        </div>
        <LeaveTable
          leaves={leaves}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{selectedLeave ? 'Edit Leave' : 'Add Leave'}</DialogTitle>
        <DialogContent>
          <LeaveForm
            leave={selectedLeave}
            doctors={doctors}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}