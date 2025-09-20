
// pharmacy/PharmacySuppliers.jsx
// Supplier management component

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import { Search, Delete, Edit } from '@mui/icons-material';
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from './pharmacyService';
import styles from './PharmacySuppliers.module.css';

const PharmacySuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '', email: '', address: '' });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const data = await getSuppliers();
    setSuppliers(data);
  };

  const handleAddSupplier = async () => {
    await addSupplier(newSupplier);
    fetchSuppliers();
    setNewSupplier({ name: '', contact: '', email: '', address: '' });
  };

  const handleUpdateSupplier = async (id, data) => {
    await updateSupplier(id, data);
    fetchSuppliers();
  };

  const handleDeleteSupplier = async (id) => {
    await deleteSupplier(id);
    fetchSuppliers();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Supplier Name', width: 200, editable: true },
    { field: 'contact', headerName: 'Contact', width: 150, editable: true },
    { field: 'email', headerName: 'Email', width: 200, editable: true },
    { field: 'address', headerName: 'Address', width: 200, editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleUpdateSupplier(params.row.id, params.row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDeleteSupplier(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Supplier Management</Typography>
      <Box className={styles.controls}>
        <TextField
          label="Search Suppliers"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <Search /> }}
          fullWidth
        />
        <Box className={styles.form}>
          <TextField
            label="Name"
            name="name"
            value={newSupplier.name}
            onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
          />
          <TextField
            label="Contact"
            name="contact"
            value={newSupplier.contact}
            onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
          />
          <TextField
            label="Email"
            name="email"
            value={newSupplier.email}
            onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
          />
          <TextField
            label="Address"
            name="address"
            value={newSupplier.address}
            onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
          />
          <Button variant="contained" onClick={handleAddSupplier}>
            Add Supplier
          </Button>
        </Box>
      </Box>
      <DataGrid
        rows={filteredSuppliers}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        className={styles.grid}
        autoHeight
        onCellEditCommit={(params) => handleUpdateSupplier(params.id, { [params.field]: params.value })}
      />
    </Box>
  );
};

export default PharmacySuppliers;