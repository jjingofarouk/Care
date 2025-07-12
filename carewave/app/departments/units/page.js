'use client';

import { useState, useEffect } from 'react';
import UnitTable from '../../components/departments/UnitTable';
import UnitForm from '../../components/departments/UnitForm';
import { getUnits, createUnit, deleteUnit } from '../../services/departmentService';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

export default function UnitsPage() {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUnits = async () => {
      const data = await getUnits();
      setUnits(data);
    };
    fetchUnits();
  }, []);

  const handleSubmit = async (formData) => {
    await createUnit(formData);
    setOpen(false);
    setSelectedUnit(null);
    const data = await getUnits();
    setUnits(data);
  };

  const handleDelete = async (id) => {
    await deleteUnit(id);
    const data = await getUnits();
    setUnits(data);
  };

  const handleEdit = (unit) => {
    setSelectedUnit(unit);
    setOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h1 className="card-title">Units Management</h1>
            <Button
              variant="contained"
              className="btn btn-primary"
              onClick={() => setOpen(true)}
            >
              Add Unit
            </Button>
          </div>
        </div>
        <UnitTable
          units={units}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{selectedUnit ? 'Edit Unit' : 'Add Unit'}</DialogTitle>
        <DialogContent>
          <UnitForm
            unit={selectedUnit}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}