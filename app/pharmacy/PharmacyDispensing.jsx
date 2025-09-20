import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Select, MenuItem, Autocomplete, Alert } from '@mui/material';
import { dispenseMedication, getUsers, getInventory, getPrescriptions } from './pharmacyService';
import styles from './PharmacyDispensing.module.css';

const PharmacyDispensing = () => {
  const [dispensingData, setDispensingData] = useState({
    prescriptionId: '',
    medicationId: '',
    quantity: '',
    patientType: 'OUTPATIENT',
    dispensedById: '',
  });
  const [prescriptions, setPrescriptions] = useState([]);
  const [pharmacists, setPharmacists] = useState([]);
  const [medications, setMedications] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, medicationData, prescriptionData] = await Promise.all([
          getUsers(),
          getInventory(),
          getPrescriptions(),
        ]);
        setPharmacists(userData.filter(u => u.role === 'PHARMACIST'));
        setMedications(medicationData);
        setPrescriptions(prescriptionData.filter(p => p.status === 'PENDING' || p.status === 'PARTIALLY_DISPENSED'));
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
      }
    };
    fetchData();
  }, []);

  const validateDispense = () => {
    if (!dispensingData.prescriptionId || !dispensingData.medicationId || !dispensingData.quantity || !dispensingData.dispensedById) {
      setError('Prescription ID, Medication, Quantity, and Pharmacist are required');
      return false;
    }
    if (isNaN(parseInt(dispensingData.quantity)) || parseInt(dispensingData.quantity) <= 0) {
      setError('Quantity must be a positive number');
      return false;
    }
    const prescription = prescriptions.find(p => p.id.toString() === dispensingData.prescriptionId);
    if (!prescription) {
      setError('Invalid prescription ID');
      return false;
    }
    const item = prescription.items.find(i => i.medicationId.toString() === dispensingData.medicationId);
    if (!item) {
      setError('Selected medication not part of this prescription');
      return false;
    }
    const medication = medications.find(m => m.id.toString() === dispensingData.medicationId);
    if (medication.stockQuantity < parseInt(dispensingData.quantity)) {
      setError('Insufficient stock for selected medication');
      return false;
    }
    return true;
  };

  const handleDispense = async () => {
    if (!validateDispense()) return;
    try {
      const payload = {
        prescriptionId: parseInt(dispensingData.prescriptionId),
        medicationId: parseInt(dispensingData.medicationId),
        quantity: parseInt(dispensingData.quantity),
        patientType: dispensingData.patientType,
        dispensedById: parseInt(dispensingData.dispensedById),
      };
      await dispenseMedication(payload);
      setDispensingData({
        prescriptionId: '',
        medicationId: '',
        quantity: '',
        patientType: 'OUTPATIENT',
        dispensedById: '',
      });
      const updatedPrescriptions = await getPrescriptions();
      setPrescriptions(updatedPrescriptions.filter(p => p.status === 'PENDING' || p.status === 'PARTIALLY_DISPENSED'));
      const updatedMedications = await getInventory();
      setMedications(updatedMedications);
      setSuccess('Medication dispensed successfully');
      setError(null);
    } catch (err) {
      setError('Failed to dispense medication: ' + err.message);
      setSuccess(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDispensingData(prev => ({ ...prev, [name]: value }));
    setError(null);
    setSuccess(null);
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Dispense Medication</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Box className={styles.form}>
        <Autocomplete
          options={prescriptions}
          getOptionLabel={(option) => `ID: ${option.id} - Patient: ${option.patient?.user?.name || 'N/A'}`}
          onChange={(e, value) => {
            setDispensingData(prev => ({
              ...prev,
              prescriptionId: value ? value.id.toString() : '',
              medicationId: '',
            }));
            setError(null);
            setSuccess(null);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Prescription"
              margin="normal"
              fullWidth
              required
            />
          )}
          value={prescriptions.find(p => p.id.toString() === dispensingData.prescriptionId) || null}
        />
        <Autocomplete
          options={
            dispensingData.prescriptionId
              ? prescriptions.find(p => p.id.toString() === dispensingData.prescriptionId)?.items.map(i => ({
                  id: i.medicationId,
                  name: i.medication.name,
                  genericName: i.medication.genericName,
                  category: i.medication.category,
                  stockQuantity: i.medication.stockQuantity,
                })) || []
              : []
          }
          getOptionLabel={(option) => `${option.name} (Generic: ${option.genericName || 'N/A'}, Category: ${option.category}, Stock: ${option.stockQuantity})`}
          onChange={(e, value) => {
            setDispensingData(prev => ({
              ...prev,
              medicationId: value ? value.id.toString() : '',
            }));
            setError(null);
            setSuccess(null);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Medication"
              margin="normal"
              fullWidth
              required
            />
          )}
          value={medications.find(m => m.id.toString() === dispensingData.medicationId) || null}
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={dispensingData.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <Select
          name="patientType"
          value={dispensingData.patientType}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          <MenuItem value="INPATIENT">Inpatient</MenuItem>
          <MenuItem value="OUTPATIENT">Outpatient</MenuItem>
        </Select>
        <Autocomplete
          options={pharmacists}
          getOptionLabel={(option) => `${option.name} (ID: ${option.id})`}
          onChange={(e, value) => {
            setDispensingData(prev => ({
              ...prev,
              dispensedById: value ? value.id.toString() : '',
            }));
            setError(null);
            setSuccess(null);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Dispensed By"
              margin="normal"
              fullWidth
              required
            />
          )}
          value={pharmacists.find(p => p.id.toString() === dispensingData.dispensedById) || null}
        />
        <Button
          variant="contained"
          onClick={handleDispense}
          sx={{ mt: 2 }}
        >
          Dispense
        </Button>
      </Box>
    </Box>
  );
};

export default PharmacyDispensing;