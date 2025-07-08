import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Typography, IconButton, Alert } from '@mui/material';
import { Search, Delete, Edit, QrCodeScanner } from '@mui/icons-material';
import { getInventory, updateStock, deleteMedication, getStockAlerts, scanBarcode } from './pharmacyService';

const PharmacyInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [stockAlerts, setStockAlerts] = useState([]);
  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    fetchInventory();
    fetchStockAlerts();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };

  const fetchStockAlerts = async () => {
    try {
      const alerts = await getStockAlerts();
      setStockAlerts(alerts);
    } catch (error) {
      console.error('Failed to fetch stock alerts:', error);
    }
  };

  const handleStockUpdate = async (id, newStock) => {
    try {
      await updateStock(id, parseInt(newStock));
      await fetchInventory();
      await fetchStockAlerts();
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedication(id);
      await fetchInventory();
      await fetchStockAlerts();
    } catch (error) {
      console.error('Failed to delete medication:', error);
    }
  };

  const handleBarcodeScan = async () => {
    try {
      const medication = await scanBarcode(barcode);
      if (medication) {
        setInventory([medication, ...inventory.filter(item => item.id !== medication.id)]);
        setBarcode('');
      }
    } catch (error) {
      console.error('Failed to scan barcode:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Medication', width: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { 
      field: 'stockQuantity', 
      headerName: 'Stock', 
      width: 120, 
      editable: true,
      type: 'number',
    },
    { field: 'price', headerName: 'Price', width: 120 },
    { 
      field: 'expiryDate', 
      headerName: 'Expiry Date', 
      width: 150, 
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString() 
    },
    { field: 'barcode', headerName: 'Barcode', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleStockUpdate(params.row.id, params.row.stockQuantity)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-hospital-white dark:bg-hospital-gray-900">
      <h2 className="text-lg font-semibold text-hospital-gray-900 dark:text-hospital-white mb-4">Inventory Management</h2>
      {stockAlerts.length > 0 && (
        <div className="mb-4 p-3 bg-hospital-warning/10 text-hospital-warning border border-hospital-warning/20 rounded-md">
          Low stock alert for {stockAlerts.length} medications
        </div>
      )}
      <div className="mb-4">
        <TextField
          label="Search Medications"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <Search /> }}
          fullWidth
          className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md"
        />
        <div className="flex gap-2 mt-2">
          <TextField
            label="Scan Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md flex-grow"
          />
          <button 
            onClick={handleBarcodeScan}
            className="p-2 bg-hospital-accent text-hospital-white hover:bg-hospital-teal-light rounded-md transition-transform duration-fast ease-in-out transform hover:-translate-y-1"
          >
            <QrCodeScanner />
          </button>
        </div>
      </div>
      <div className="h-[600px] w-full">
        <DataGrid
          rows={filteredInventory}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white"
          onCellEditStop={(params, event) => {
            if (params.reason === 'enterKeyDown' || params.reason === 'cellFocusOut') {
              handleStockUpdate(params.row.id, event.target.value);
            }
          }}
        />
      </div>
    </div>
  );
};

export default PharmacyInventory;