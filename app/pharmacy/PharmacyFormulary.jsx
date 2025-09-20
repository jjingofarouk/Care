// pharmacy/PharmacyFormulary.jsx
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, TextField, Button, Alert, CircularProgress, Autocomplete } from '@mui/material';
import { getFormularies, addFormulary, getMedications } from './pharmacyService';
import styles from './PharmacyFormulary.module.css';

const PharmacyFormulary = () => {
  const [formularies, setFormularies] = useState([]);
  const [medications, setMedications] = useState([]);
  const [newFormulary, setNewFormulary] = useState({ name: '', description: '', medicationIds: [] });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [formularyData, medicationData] = await Promise.all([
        getFormularies(),
        getMedications(), // New service function to fetch medications
      ]);
      setFormularies(formularyData);
      setMedications(medicationData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFormulary = async () => {
    setLoading(true);
    try {
      const formulary = await addFormulary(newFormulary);
      setFormularies([...formularies, formulary]);
      setNewFormulary({ name: '', description: '', medicationIds: [] });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to add formulary');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    {
      field: 'medications',
      headerName: 'Medications',
      width: 300,
      valueGetter: ({ value }) => (value && Array.isArray(value) ? value.map(m => m.name).join(', ') : ''),
    },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Formulary Management</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box className={styles.form}>
        <TextField
          label="Name"
          name="name"
          value={newFormulary.name}
          onChange={(e) => setNewFormulary({ ...newFormulary, name: e.target.value })}
          fullWidth
          margin="normal"
          disabled={loading}
        />
        <TextField
          label="Description"
          name="description"
          value={newFormulary.description}
          onChange={(e) => setNewFormulary({ ...newFormulary, description: e.target.value })}
          fullWidth
          margin="normal"
          disabled={loading}
        />
        <Autocomplete
          multiple
          options={medications}
          getOptionLabel={(option) => option.name}
          value={medications.filter(m => newFormulary.medicationIds.includes(m.id))}
          onChange={(e, newValue) => setNewFormulary({ ...newFormulary, medicationIds: newValue.map(m => m.id) })}
          renderInput={(params) => <TextField {...params} label="Medications" margin="normal" />}
          disabled={loading}
        />
        <Button
          variant="contained"
          onClick={handleAddFormulary}
          disabled={loading || !newFormulary.name}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Add Formulary'}
        </Button>
      </Box>
      <DataGrid
        rows={formularies}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        className={styles.grid}
        autoHeight
        loading={loading}
      />
    </Box>
  );
};

export default PharmacyFormulary;