"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getTransactions, getPayrolls, getAssets } from './accountingService';
import styles from './AccountingList.module.css';

export default function AccountingList({ type, onSelectItem }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        let data;
        if (type === 'transaction') data = await getTransactions();
        if (type === 'payroll') data = await getPayrolls();
        if (type === 'asset') data = await getAssets();

        const formattedItems = Array.isArray(data)
          ? data.map(item => ({
              id: item.id,
              date: item.date
                ? new Date(item.date).toLocaleDateString()
                : item.purchaseDate
                ? new Date(item.purchaseDate).toLocaleDateString()
                : 'N/A',
              description: item.description || item.employee || item.name || 'N/A',
              amount: item.amount || item.value || 'N/A',
              rawData: item,
            }))
          : [];
        setItems(formattedItems);
        setError(null);
      } catch (error) {
        console.error(`Error fetching ${type}s:`, error);
        setError(error.response?.data?.details || error.message);
      }
    }
    fetchData();
  }, [type]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'date',
      headerName: type === 'asset' ? 'Purchase Date' : 'Date',
      width: 150,
    },
    {
      field: 'description',
      headerName:
        type === 'transaction'
          ? 'Description'
          : type === 'payroll'
          ? 'Employee'
          : 'Name',
      width: 200,
    },
    {
      field: 'amount',
      headerName: type === 'asset' ? 'Value' : 'Amount',
      width: 150,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => onSelectItem(params.row.rawData)}
          disabled={!params.row.rawData}
          className={styles.actionButton}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        {type.charAt(0).toUpperCase() + type.slice(1)} History
      </Typography>
      {error && (
        <Alert severity="error" className={styles.alert}>
          Failed to load {type}s: {error}
        </Alert>
      )}
      {items.length === 0 && !error && (
        <Alert severity="info" className={styles.alert}>
          No {type}s found.
        </Alert>
      )}
      <Box className={styles.tableWrapper}>
        <DataGrid
          rows={items}
          columns={columns}
          pageSizeOptions={[5, 10, 20, 50]}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          className={styles.dataGrid}
        />
      </Box>
    </Box>
  );
}