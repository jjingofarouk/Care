
// pharmacy/PharmacyOrders.jsx
// Purchase order management component

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Box, Typography, MenuItem, Select } from '@mui/material';
import { Search } from '@mui/icons-material';
import { getOrders, updateOrderStatus, createOrder } from './pharmacyService';
import styles from './PharmacyOrders.module.css';

const PharmacyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateOrderStatus(id, newStatus);
    fetchOrders();
  };

  const handleCreateOrder = async () => {
    await createOrder({ supplierId: 0, items: [] });
    fetchOrders();
  };

  const columns = [
    { field: 'id', headerName: 'Order ID', width: 100 },
    { field: 'medication', headerName: 'Medications', width: 200, valueGetter: ({ row }) => row.items.map(item => item.medication.name).join(', ') },
    { field: 'quantity', headerName: 'Quantity', width: 120, valueGetter: ({ row }) => row.items.reduce((sum, item) => sum + item.quantity, 0) },
    { field: 'supplier', headerName: 'Supplier', width: 150, valueGetter: ({ row }) => row.supplier.name },
    { field: 'orderDate', headerName: 'Order Date', width: 150, valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Select
          value={params.row.status}
          onChange={(e) => handleStatusChange(params.row.id, e.target.value)}
        >
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="PROCESSING">Processing</MenuItem>
          <MenuItem value="DELIVERED">Delivered</MenuItem>
        </Select>
      ),
    },
  ];

  const filteredOrders = orders.filter(order =>
    order.items.some(item => item.medication.name.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === 'all' || order.status === statusFilter)
  );

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Order Management</Typography>
      <Box className={styles.controls}>
        <TextField
          label="Search Orders"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <Search /> }}
          className={styles.search}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filter}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="PROCESSING">Processing</MenuItem>
          <MenuItem value="DELIVERED">Delivered</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleCreateOrder}>
          New Order
        </Button>
      </Box>
      <DataGrid
        rows={filteredOrders}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        className={styles.grid}
        autoHeight
      />
    </Box>
  );
};

export default PharmacyOrders;