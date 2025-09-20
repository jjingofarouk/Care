"use client";

import React, { useState } from 'react';
import { createTransaction } from './accountingService';
import styles from './AccountingForm.module.css';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from '@mui/material';

export default function AccountingForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    status: 'PENDING',
    type: 'GENERAL_LEDGER',
    date: '',
    costCenterId: '',
    patientId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category || !formData.status || !formData.type) {
      alert('Please fill all required fields');
      return;
    }
    try {
      const transactionData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        status: formData.status,
        type: formData.type,
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
        costCenterId: formData.costCenterId ? parseInt(formData.costCenterId) : null,
        patientId: formData.patientId ? parseInt(formData.patientId) : null,
      };
      await createTransaction(transactionData);
      onSubmit();
      setFormData({
        description: '',
        amount: '',
        category: '',
        status: 'PENDING',
        type: 'GENERAL_LEDGER',
        date: '',
        costCenterId: '',
        patientId: '',
      });
      alert('Transaction created successfully!');
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert(`Failed to create transaction: ${error.message}`);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className={styles.form}>
      <Typography variant="h6" className={styles.title}>
        Add New Transaction
      </Typography>
      <FormControl className={styles.field}>
        <TextField
          id="description"
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          className={styles.input}
        />
      </FormControl>
      <FormControl className={styles.field}>
        <TextField
          id="amount"
          name="amount"
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          inputProps={{ step: '0.01' }}
          className={styles.input}
        />
      </FormControl>
      <FormControl className={styles.field}>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          fullWidth
          label="Category"
          className={styles.input}
        >
          <MenuItem value="">Select Category</MenuItem>
          <MenuItem value="INCOME">Income</MenuItem>
          <MenuItem value="EXPENSE">Expense</MenuItem>
          <MenuItem value="RECEIVABLE">Receivable</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={styles.field}>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          fullWidth
          label="Status"
          className={styles.input}
        >
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="PAID">Paid</MenuItem>
          <MenuItem value="OVERDUE">Overdue</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={styles.field}>
        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          fullWidth
          label="Type"
          className={styles.input}
        >
          <MenuItem value="GENERAL_LEDGER">General Ledger</MenuItem>
          <MenuItem value="RECEIVABLE">Receivable</MenuItem>
          <MenuItem value="EXPENSE">Expense</MenuItem>
        </Select>
      </FormControl>
      <FormControl className={styles.field}>
        <TextField
          id="date"
          name="date"
          label="Date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          className={styles.input}
        />
      </FormControl>
      <FormControl className={styles.field}>
        <TextField
          id="costCenterId"
          name="costCenterId"
          label="Cost Center ID (Optional)"
          type="number"
          value={formData.costCenterId}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          className={styles.input}
        />
      </FormControl>
      <FormControl className={styles.field}>
        <TextField
          id="patientId"
          name="patientId"
          label="Patient ID (Optional)"
          type="number"
          value={formData.patientId}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          className={styles.input}
        />
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        className={styles.submit}
        fullWidth
      >
        Add Transaction
      </Button>
    </Box>
  );
}