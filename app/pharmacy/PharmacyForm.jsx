// pharmacy/PharmacyForm.jsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, FormControlLabel, Checkbox, Alert } from '@mui/material';
import { addMedication, getSuppliers, getFormularies } from './pharmacyService';

export default function PharmacyForm() {
  const [medicationData, setMedicationData] = useState({
    name: '',
    genericName: '',
    category: '',
    batchNumber: '',
    barcode: '',
    rfid: '',
    stockQuantity: '',
    minStockThreshold: 10,
    price: '',
    expiryDate: '',
    supplierId: '',
    formularyId: '',
    narcotic: false,
  });
  const [suppliers, setSuppliers] = useState([]);
  const [formularies, setFormularies] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [supplierData, formularyData] = await Promise.all([
          getSuppliers(),
          getFormularies(),
        ]);
        setSuppliers(supplierData);
        setFormularies(formularyData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const validateMedication = () => {
    const requiredFields = ['name', 'category', 'batchNumber', 'stockQuantity', 'price', 'expiryDate'];
    for (const field of requiredFields) {
      if (!medicationData[field]) {
        setError(`Missing required field: ${field}`);
        return false;
      }
    }
    if (isNaN(parseInt(medicationData.stockQuantity)) || parseInt(medicationData.stockQuantity) < 0) {
      setError('Stock Quantity must be a non-negative number');
      return false;
    }
    if (isNaN(parseFloat(medicationData.price)) || parseFloat(medicationData.price) < 0) {
      setError('Price must be a non-negative number');
      return false;
    }
    if (new Date(medicationData.expiryDate) <= new Date()) {
      setError('Expiry Date must be in the future');
      return false;
    }
    return true;
  };

  const handleMedicationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMedicationData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleMedicationSubmit = async (e) => {
    e.preventDefault();
    if (!validateMedication()) return;

    try {
      const payload = {
        ...medicationData,
        stockQuantity: parseInt(medicationData.stockQuantity),
        minStockThreshold: parseInt(medicationData.minStockThreshold) || 10,
        price: parseFloat(medicationData.price),
        supplierId: medicationData.supplierId ? parseInt(medicationData.supplierId) : null,
        formularyId: medicationData.formularyId ? parseInt(medicationData.formularyId) : null,
      };
      await addMedication(payload);
      setMedicationData({
        name: '',
        genericName: '',
        category: '',
        batchNumber: '',
        barcode: '',
        rfid: '',
        stockQuantity: '',
        minStockThreshold: 10,
        price: '',
        expiryDate: '',
        supplierId: '',
        formularyId: '',
        narcotic: false,
      });
      setSuccess('Medication added successfully');
      setError(null);
    } catch (err) {
      setError('Failed to add medication: ' + err.message);
      setSuccess(null);
    }
  };

  return (
    <Box className="p-6 bg-hospital-white dark:bg-hospital-gray-900">
      <h2 className="text-lg font-semibold text-hospital-gray-900 dark:text-hospital-white mb-4">Add New Medication</h2>
      {error && <Alert severity="error" className="mb-4">{error}</Alert>}
      {success && <Alert severity="success" className="mb-4">{success}</Alert>}
      {loading ? (
        <Box className="space-y-4">
          <Box className="h-16 bg-hospital-gray-100 dark:bg-hospital-gray-700 rounded-md animate-pulse"></Box>
          <Box className="h-96 bg-hospital-gray-100 dark:bg-hospital-gray-700 rounded-md animate-pulse"></Box>
        </Box>
      ) : (
        <form onSubmit={handleMedicationSubmit} className="space-y-4">
          <TextField
            label="Medication Name"
            name="name"
            value={medicationData.name}
            onChange={handleMedicationChange}
            fullWidth
            required
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          />
          <TextField
            label="Generic Name"
            name="genericName"
            value={medicationData.genericName}
            onChange={handleMedicationChange}
            fullWidth
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          />
          <TextField
            select
            label="Category"
            name="category"
            value={medicationData.category}
            onChange={handleMedicationChange}
            fullWidth
            required
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          >
            <MenuItem value="Analgesics">Analgesics</MenuItem>
            <MenuItem value="Antibiotics">Antibiotics</MenuItem>
            <MenuItem value="Antivirals">Antivirals</MenuItem>
            <MenuItem value="Narcotics">Narcotics</MenuItem>
          </TextField>
          <TextField
            label="Batch Number"
            name="batchNumber"
            value={medicationData.batchNumber}
            onChange={handleMedicationChange}
            fullWidth
            required
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          />
          <TextField
            label="Barcode"
            name="barcode"
            value={medicationData.barcode}
            onChange={handleMedicationChange}
            fullWidth
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          />
          <TextField
            label="RFID"
            name="rfid"
            value={medicationData.rfid}
            onChange={handleMedicationChange}
            fullWidth
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          />
          <TextField
            label="Stock Quantity"
            name="stockQuantity"
            type="number"
            value={medicationData.stockQuantity}
            onChange={handleMedicationChange}
            fullWidth
            required
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          />
          <TextField
            label="Minimum Stock Threshold"
            name="minStockThreshold"
            type="number"
            value={medicationData.minStockThreshold}
            onChange={handleMedicationChange}
            fullWidth
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={medicationData.price}
            onChange={handleMedicationChange}
            fullWidth
            required
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          />
          <TextField
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={medicationData.expiryDate}
            onChange={handleMedicationChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          />
          <TextField
            select
            label="Supplier"
            name="supplierId"
            value={medicationData.supplierId}
            onChange={handleMedicationChange}
            fullWidth
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          >
            <MenuItem value="">None</MenuItem>
            {suppliers.map(supplier => (
              <MenuItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Formulary"
            name="formularyId"
            value={medicationData.formularyId}
            onChange={handleMedicationChange}
            fullWidth
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
          >
            <MenuItem value="">None</MenuItem>
            {formularies.map(formulary => (
              <MenuItem key={formulary.id} value={formulary.id}>
                {formulary.name}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                name="narcotic"
                checked={medicationData.narcotic}
                onChange={handleMedicationChange}
                className="text-hospital-accent dark:text-hospital-teal-light"
              />
            }
            label="Narcotic"
            className="text-hospital-gray-900 dark:text-hospital-white"
          />
          <Button
            type="submit"
            variant="contained"
            className="bg-hospital-accent text-hospital-white hover:bg-hospital-teal-light rounded-md px-4 py-2"
          >
            Add Medication
          </Button>
        </form>
      )}
    </Box>
  );
}