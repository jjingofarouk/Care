'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import VisitTypeForm from '@/components/appointments/VisitTypeForm';

export default function VisitTypesPage() {
  const [visitTypes, setVisitTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingVisitType, setEditingVisitType] = useState(null);

  const fetchVisitTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/appointments?resource=visitTypes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch visit types');
      const data = await response.json();
      setVisitTypes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/appointments?resource=visitType&id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to delete visit type');
      fetchVisitTypes();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchVisitTypes();
  }, []);

  return (
    <div className="max-w-full mx-auto p-2 sm:p-4">
      <div className="flex justify-between items-center mb-2">
        <Typography variant="h4" className="text-[var(--hospital-gray-900)] font-bold">
          Visit Types
        </Typography>
        <Button
          variant="contained"
          className="btn-primary"
          startIcon={<PlusCircle className="h-5 w-5" />}
          onClick={() => setEditingVisitType({})}
          component={Link}
          href="/appointments/visit-types/new"
        >
          New Visit Type
        </Button>
      </div>
      {error && (
        <div className="alert alert-error mb-2">
          <span>{error}</span>
        </div>
      )}
      {editingVisitType && (
        <VisitTypeForm
          visitType={editingVisitType}
          onSubmit={fetchVisitTypes}
          onCancel={() => setEditingVisitType(null)}
        />
      )}
      <div className="card max-w-full mx-auto">
        <Table className="table w-full">
          <TableHead>
            <TableRow>
              <TableCell className="font-semibold">Name</TableCell>
              <TableCell className="font-semibold">Description</TableCell>
              <TableCell className="font-semibold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <div className="loading-spinner mx-auto"></div>
                </TableCell>
              </TableRow>
            ) : visitTypes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-[var(--hospital-gray-500)]">
                  No visit types available
                </TableCell>
              </TableRow>
            ) : (
              visitTypes.map((type) => (
                <TableRow key={type.id} className="hover:bg-[var(--hospital-gray-50)]">
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.description || 'N/A'}</TableCell>
                  <TableCell>
                    <IconButton className="btn-outline" onClick={() => setEditingVisitType(type)}>
                      <Edit className="h-4 w-4" />
                    </IconButton>
                    <IconButton className="btn-outline" onClick={() => handleDelete(type.id)}>
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}