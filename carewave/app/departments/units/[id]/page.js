'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UnitForm from '../../../components/departments/UnitForm';
import { getUnit, updateUnit, deleteUnit } from '../../../services/departmentService';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

export default function UnitEditPage() {
  const [unit, setUnit] = useState(null);
  const [open, setOpen] = useState(true);
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchUnit = async () => {
      const data = await getUnit(id);
      setUnit(data);
    };
    fetchUnit();
  }, [id]);

  const handleSubmit = async (formData) => {
    await updateUnit(id, formData);
    setOpen(false);
    router.push('/departments/units');
  };

  const handleDelete = async () => {
    await deleteUnit(id);
    router.push('/departments/units');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h1 className="card-title">Edit Unit</h1>
            <Button
              variant="contained"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete Unit
            </Button>
          </div>
        </div>
        {unit && (
          <Dialog open={open} onClose={() => router.push('/departments/units')}>
            <DialogTitle>Edit Unit</DialogTitle>
            <DialogContent>
              <UnitForm
                unit={unit}
                onSubmit={handleSubmit}
                onCancel={() => router.push('/departments/units')}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}