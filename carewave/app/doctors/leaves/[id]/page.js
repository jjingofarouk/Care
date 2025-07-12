'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LeaveForm from '../../../components/doctors/LeaveForm';
import { getLeave, updateLeave, deleteLeave, getDoctors } from '@/services/doctorService';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

export default function LeaveEditPage() {
  const [leave, setLeave] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchData = async () => {
      const leaveData = await getLeave(id);
      const doctorsData = await getDoctors();
      setLeave(leaveData);
      setDoctors(doctorsData);
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (formData) => {
    await updateLeave(id, formData);
    setOpen(false);
    router.push('/doctors/leaves');
  };

  const handleDelete = async () => {
    await deleteLeave(id);
    router.push('/doctors/leaves');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h1 className="card-title">Edit Leave</h1>
            <Button
              variant="contained"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete Leave
            </Button>
          </div>
        </div>
        {leave && (
          <Dialog open={open} onClose={() => router.push('/doctors/leaves')}>
            <DialogTitle>Edit Leave</DialogTitle>
            <DialogContent>
              <LeaveForm
                leave={leave}
                doctors={doctors}
                onSubmit={handleSubmit}
                onCancel={() => router.push('/doctors/leaves')}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}