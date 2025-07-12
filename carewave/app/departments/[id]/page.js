'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DepartmentForm from '../../components/departments/DepartmentForm';
import { getDepartment, updateDepartment, deleteDepartment } from '../../services/departmentService';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

export default function DepartmentEditPage() {
  const [department, setDepartment] = useState(null);
  const [open, setOpen] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchDepartment = async () => {
      const data = await getDepartment(id);
      setDepartment(data);
    };
    fetchDepartment();
  }, [id]);

  const handleSubmit = async (formData) => {
    await updateDepartment(id, formData);
    setOpen(false);
    router.push('/departments');
  };

  const handleDelete = async () => {
    await deleteDepartment(id);
    router.push('/departments');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h1 className="card-title">Edit Department</h1>
            <Button
              variant="contained"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete Department
            </Button>
          </div>
        </div>
        {department && (
          <Dialog open={open} onClose={() => router.push('/departments')}>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogContent>
              <DepartmentForm
                department={department}
                onSubmit={handleSubmit}
                onCancel={() => router.push('/departments')}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}