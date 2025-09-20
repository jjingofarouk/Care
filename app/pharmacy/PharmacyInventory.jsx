// pharmacy/PharmacyInventory.jsx
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, IconButton, Alert } from '@mui/material';
import { Search, Delete, Edit, QrCodeScanner } from '@mui/icons-material';
import { getInventory, updateStock, deleteMedication, getStockAlerts, scanBarcode } from './pharmacyService';

export default function PharmacyInventory() {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [stockAlerts, setStockAlerts] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
    fetchStockAlerts();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await getInventory();
      setInventory(data);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.details || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockAlerts = async () => {
    try {
      const alerts = await getStockAlerts();
      setStockAlerts(alerts);
    } catch (error) {
      setError(error.response?.data?.details || error.message);
    }
  };

  const handleStockUpdate = async (id, newStock) => {
    try {
      await updateStock(id, parseInt(newStock));
      await fetchInventory();
      await fetchStockAlerts();
      setError(null);
    } catch (error) {
      setError(error.response?.data?.details || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedication(id);
      await fetchInventory();
      await fetchStockAlerts();
      setError(null);
    } catch (error) {
      setError(error.response?.data?.details || error.message);
    }
  };

  const handleBarcodeScan = async () => {
    try {
      const medication = await scanBarcode(barcode);
      if (medication) {
        setInventory([medication, ...inventory.filter(item => item.id !== medication.id)]);
        setBarcode('');
        setError(null);
      }
    } catch (error) {
      setError(error.response?.data?.details || error.message);
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
          <IconButton 
            onClick={() => handleStockUpdate(params.row.id, params.row.stockQuantity)}
            className="text-hospital-accent dark:text-hospital-teal-light hover:text-hospital-teal-light"
          >
            <Edit />
          </IconButton>
          <IconButton 
            onClick={() => handleDelete(params.row.id)}
            className="text-hospital-error hover:text-hospital-error-dark"
          >
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
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      {stockAlerts.length > 0 && (
        <Alert severity="warning" className="mb-4">
          Low stock alert for {stockAlerts.length} medications
        </Alert>
      )}
      {loading ? (
        <div className="space-y-4">
          <div className="h-16 bg-hospital-gray-100 dark:bg-hospital-gray-700 rounded-md animate-pulse"></div>
          <div className="h-96 bg-hospital-gray-100 dark:bg-hospital-gray-700 rounded-md animate-pulse"></div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <TextField
              label="Search Medications"
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <Search /> }}
              fullWidth
              className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            />
            <div className="flex gap-2 mt-2">
              <TextField
                label="Scan Barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md flex-grow"
              />
              <IconButton 
                onClick={handleBarcodeScan}
                className="bg-hospital-accent text-hospital-white hover:bg-hospital-teal-light rounded-md"
              >
                <QrCodeScanner />
              </IconButton>
            </div>
          </div>
          <div className="h-[600px] w-full">
            <DataGrid
              rows={filteredInventory}
              columns={columns}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md shadow-md"
              onCellEditStop={(params, event) => {
                if (params.reason === 'enterKeyDown' || params.reason === 'cellFocusOut') {
                  handleStockUpdate(params.row.id, event.target.value);
                }
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}