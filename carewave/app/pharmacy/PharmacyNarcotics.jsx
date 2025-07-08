import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Typography, IconButton, Alert } from '@mui/material';
import { Search, Delete, Edit, QrCodeScanner } from '@mui/icons-material';
import { getInventory, updateStock, deleteMedication, getStockAlerts, scanBarcode } from './pharmacyService';

const PharmacyNarcotics = () => {
  const [narcotics, setNarcotics] = useState([]);
  const [search, setSearch] = useState('');
  const [stockAlerts, setStockAlerts] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNarcotics();
    fetchStockAlerts();
  }, []);

  const fetchNarcotics = async () => {
    try {
      const data = await getInventory();
      console.log('Inventory data:', data);
      const narcoticDrugs = Array.isArray(data)
        ? data.filter(item => {
            const isNarcotic = item?.narcotic === true;
            if (!isNarcotic) console.log('Non-narcotic item filtered out:', item);
            return isNarcotic;
          })
        : [];
      setNarcotics(narcoticDrugs);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch narcotics:', error);
      setError('Failed to fetch narcotic inventory');
      setNarcotics([]);
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
      console.error('Failed to fetch stock alerts:', error);
      setError('Failed to fetch stock alerts');
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
      console.error('Failed to update stock:', error);
      setError('Failed to update stock');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedication(id);
      await fetchNarcotics();
      await fetchStockAlerts();
      setError(null);
    } catch (error) {
      console.error('Failed to delete medication:', error);
      setError('Failed to delete medication');
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
      console.error('Failed to scan barcode:', error);
      setError('Failed to scan barcode');
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

  const filteredNarcotics = narcotics.filter(item =>
    item?.name?.toLowerCase()?.includes(search.toLowerCase()) ?? false
  );

  return (
    <div className="p-6 bg-hospital-white dark:bg-hospital-gray-900">
      <h2 className="text-lg font-semibold text-hospital-gray-900 dark:text-hospital-white mb-4">Narcotic Drug Tracking</h2>
      {error && (
        <div className="mb-4 p-3 bg-hospital-error/10 text-hospital-error border border-hospital-error/20 rounded-md">
          {error}
        </div>
      )}
      {stockAlerts.length > 0 && (
        <div className="mb-4 p-3 bg-hospital-warning/10 text-hospital-warning border border-hospital-warning/20 rounded-md">
          Low stock alert for {stockAlerts.length} narcotic medications
        </div>
      )}
      <div className="mb-4">
        <TextField
          label="Search Narcotics"
          variant="outlined"
          value={search ?? ''}
          onChange={(e) => setSearch(e.target.value ?? '')}
          InputProps={{ startAdornment: <Search /> }}
          fullWidth
          className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md mb-4"
        />
        <div className="flex gap-2">
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
      <div className="w-full">
        <DataGrid
          rows={filteredNarcotics}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
          className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white"
          autoHeight
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

export default PharmacyNarcotics;