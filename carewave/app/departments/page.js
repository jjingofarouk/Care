'use client';

import { useState, useEffect } from 'react';
import DepartmentTable from '../components/departments/DepartmentTable';
import DepartmentForm from '../components/departments/DepartmentForm';
import { getDepartments, createDepartment, deleteDepartment } from '../services/departmentService';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      const data = await getDepartments();
      setDepartments(data);
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (formData) => {
    await createDepartment(formData);
    setOpen(false);
    setSelectedDepartment(null);
    const data = await getDepartments();
    setDepartments(data);
  };

  const handleDelete = async (id) => {
    await deleteDepartment(id);
    const data = await getDepartments();
    setDepartments(data);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h1 className="card-title">Departments Management</h1>
            <Button
              variant="contained"
              className="btn btn-primary"
              onClick={() => setOpen(true)}
            >
              Add Department
            </Button>
          </div>
        </div>
        <DepartmentTable
          departments={departments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{selectedDepartment ? 'Edit Department' : 'Add Department'}</DialogTitle>
        <DialogContent>
          <DepartmentForm
            department={selectedDepartment}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}