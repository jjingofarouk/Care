// pharmacy/PharmacyNarcotics.jsx
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, IconButton, Alert } from '@mui/material';
import { Search, Delete, Edit, QrCodeScanner } from '@mui/icons-material';
import { getInventory, updateStock, deleteMedication, getStockAlerts, scanBarcode } from './pharmacyService';

export default function PharmacyNarcotics() {
  const [narcotics, setNarcotics] = useState([]);
  const [search, setSearch] = useState('');
  const [stockAlerts, setStockAlerts] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNarcotics();
    fetchStockAlerts();
  }, []);

  const fetchNarcotics = async () => {
    try {
      setLoading(true);
      const data = await getInventory();
      const narcoticDrugs = Array.isArray(data)
        ? data.filter(item => item?.narcotic === true)
        : [];
      setNarcotics(narcoticDrugs);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.details || error.message);
      setNarcotics([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockAlerts = async () => {
    try {
      const alerts = await getStockAlerts();
      const narcoticAlerts = Array.isArray(alerts)
        ? alerts.filter(alert => alert?.narcotic === true)
        : [];
      setStockAlerts(narcoticAlerts);
    } catch (error) {
      setError(error.response?.data?.details || error.message);
    }
  };

  const handleStockUpdate = async (id, newStock) => {
    try {
      const parsedStock = parseInt(newStock);
      if (isNaN(parsedStock) || parsedStock < 0) {
        setError('Stock quantity must be a non-negative number');
        return;
      }
      await updateStock(id, parsedStock);
      await fetchNarcotics();
      await fetchStockAlerts();
      setError(null);
    } catch (error) {
      setError(error.response?.data?.details || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedication(id);
      await fetchNarcotics();
      await fetchStockAlerts();
      setError(null);
    } catch (error) {
      setError(error.response?.data?.details || error.message);
    }
  };

  const handleBarcodeScan = async () => {
    try {
      const medication = await scanBarcode(barcode);
      if (medication && medication.narcotic === true) {
        setNarcotics([medication, ...narcotics.filter(item => item.id !== medication.id)]);
        setBarcode('');
        setError(null);
      } else {
        setError('Scanned medication is not a narcotic or not found');
      }
    } catch (error) {
      setError(error.response?.data?.details || error.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90, valueGetter: ({ row }) => row?.id ?? 'N/A' },
    { field: 'name', headerName: 'Medication', width: 200, valueGetter: ({ row }) => row?.name ?? 'Unknown' },
    { field: 'category', headerName: 'Category', width: 150, valueGetter: ({ row }) => row?.category ?? 'Unknown' },
    {
      field: 'stockQuantity',
      headerName: 'Stock',
      width: 120,
      editable: true,
      type: 'number',
      valueGetter: ({ row }) => row?.stockQuantity ?? 0,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      valueFormatter: ({ value }) => (typeof value === 'number' ? `$${value.toFixed(2)}` : '-'),
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      width: 150,
      valueFormatter: ({ value }) => (value && !isNaN(new Date(value).getTime()) ? new Date(value).toLocaleDateString() : '-'),
    },
    { field: 'barcode', headerName: 'Barcode', width: 150, valueGetter: ({ row }) => row?.barcode ?? 'N/A' },
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

  const filteredNarcotics = narcotics.filter(item =>
    item?.name?.toLowerCase()?.includes(search.toLowerCase()) ?? false
  );

  return (
    <div className="p-6 bg-hospital-white dark:bg-hospital-gray-900">
      <h2 className="text-lg font-semibold text-hospital-gray-900 dark:text-hospital-white mb-4">Narcotic Drug Tracking</h2>
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      {stockAlerts.length > 0 && (
        <Alert severity="warning" className="mb-4">
          Low stock alert for {stockAlerts.length} narcotic medications
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
              label="Search Narcotics"
              variant="outlined"
              value={search ?? ''}
              onChange={(e) => setSearch(e.target.value ?? '')}
              InputProps={{ startAdornment: <Search /> }}
              fullWidth
              className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md mb-4"
            />
            <div className="flex gap-2">
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
          <div className="w-full">
            <DataGrid
              rows={filteredNarcotics}
              columns={columns}
              pageSizeOptions={[10, 25, 50]}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              disableRowSelectionOnClick
              className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md shadow-md"
              autoHeight
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