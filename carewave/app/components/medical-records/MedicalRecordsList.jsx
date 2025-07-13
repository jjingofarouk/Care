'use client';
import React from 'react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, IconButton } from '@mui/material';
import { Edit, Trash2 } from 'lucide-react';
import MedicalRecordForm from './MedicalRecordForm';

export default function MedicalRecordList({ records, onDelete }) {
  const [editRecord, setEditRecord] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleEdit = (record) => {
    setEditRecord(record);
    setDrawerOpen(true);
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Patient</TableCell>
            <TableCell>Record Date</TableCell>
            <TableCell>Allergies</TableCell>
            <TableCell>Diagnoses</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map(record => (
            <TableRow key={record.id}>
              <TableCell>{record.patient?.name}</TableCell>
              <TableCell>{new Date(record.recordDate).toLocaleDateString()}</TableCell>
              <TableCell>{record.allergies?.length || 0}</TableCell>
              <TableCell>{record.diagnoses?.length || 0}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(record)}>
                  <Edit size={20} />
                </IconButton>
                <IconButton onClick={() => onDelete(record.id)}>
                  <Trash2 size={20} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: '500px', md: '600px' },
            p: 2,
          },
        }}
      >
        <MedicalRecordForm
          initialData={editRecord || {}}
          onSubmit={() => {
            setDrawerOpen(false);
            setEditRecord(null);
          }}
        />
      </Drawer>
    </>
  );
}