'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip, IconButton, Button, Menu, MenuItem, Box, TextField, InputAdornment } from '@mui/material';
import { Edit, Trash2, MoreHorizontal, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function InventoryTable({ inventory = [], loading, onInventoryItemDeleted }) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState(inventory);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    setFilteredInventory(
      inventory.filter(
        (item) =>
          item.drug?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, inventory]);

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await fetch(`/api/pharmacy/inventory?id=${selectedItem}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (onInventoryItemDeleted) {
        onInventoryItemDeleted(selectedItem);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error('Error deleting inventory item:', err);
      alert('Failed to delete inventory item: ' + err.message);
    } finally {
      setDeleteLoading(false);
      handleMenuClose();
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedRows.length) return;

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await Promise.all(
        selectedRows.map((id) =>
          fetch(`/api/pharmacy/inventory?id=${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      if (onInventoryItemDeleted) {
        selectedRows.forEach((id) => onInventoryItemDeleted(id));
      } else {
        router.refresh();
      }
      setSelectedRows([]);
    } catch (err) {
      console.error('Error deleting inventory items:', err);
      alert('Failed to delete inventory items: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStockStatus = (quantity, expiryDate) => {
    const isExpired = new Date(expiryDate) < new Date();
    if (isExpired) {
      return <Chip label="Expired" className="badge-error" />;
    }
    if (quantity <= 10) {
      return <Chip label="Low Stock" className="badge-warning" />;
    }
    return <Chip label="In Stock" className="badge-success" />;
  };

  const columns = [
    {
      field: 'drugName',
      headerName: 'Drug',
      width: 200,
      renderCell: (params) => params.row.drug?.name || 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
      sortable: true,
    },
    {
      field: 'batchNumber',
      headerName: 'Batch Number',
      width: 150,
      renderCell: (params) => params.row.batchNumber || 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
      sortable: true,
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      width: 150,
      renderCell: (params) =>
        params.row.expiryDate ? format(new Date(params.row.expiryDate), 'PP') : 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
      sortable: true,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 100,
      type: 'number',
      renderCell: (params) => params.row.quantity || 0,
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
      sortable: true,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => getStockStatus(params.row.quantity, params.row.expiryDate),
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      renderCell: (params) =>
        params.row.createdAt ? format(new Date(params.row.createdAt), 'PPp') : 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
      sortable: true,
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width: 180,
      renderCell: (params) =>
        params.row.updatedAt ? format(new Date(params.row.updatedAt), 'PPp') : 'N/A',
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
      sortable: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box className="flex gap-2">
          <Link href={`/inventory/${params.row.id}/edit`}>
            <IconButton className="btn-outline" size="small">
              <Edit className="h-4 w-4" />
            </IconButton>
          </Link>
          <IconButton
            className="btn-outline"
            size="small"
            onClick={(e) => handleMenuClick(e, params.row.id)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </IconButton>
        </Box>
      ),
      headerClassName: 'font-semibold text-[var(--hospital-gray-500)] uppercase tracking-wider bg-[var(--hospital-gray-50)]',
    },
  ];

  const rows = filteredInventory.map((item) => ({
    id: item.id,
    drug: item.drug,
    batchNumber: item.batchNumber,
    expiryDate: item.expiryDate,
    quantity: item.quantity,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));

  return (
    <div className="card w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Pharmacy Inventory</h2>
        <Box className="flex gap-2">
          <TextField
            placeholder="Search by drug or batch number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="h-4 w-4 text-[var(--hospital-gray-500)]" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          {selectedRows.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleBulkDelete}
              disabled={deleteLoading}
              startIcon={<Trash2 className="h-4 w-4" />}
            >
              {deleteLoading ? 'Deleting...' : `Delete ${selectedRows.length} items`}
            </Button>
          )}
        </Box>
      </div>
      <div style={{ height: 600, width: '100%' }} className="overflow-x-auto custom-scrollbar">
        <DataGrid
          rows={loading ? [] : rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          loading={loading}
          checkboxSelection
          onSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
          disableSelectionOnClick
          autoHeight={false}
          sx={{
            '& .MuiDataGrid-root': {
              border: 'none',
              backgroundColor: 'var(--hospital-white)',
              borderRadius: '0.5rem',
              boxShadow: 'var(--shadow-sm)',
            },
            '& .MuiDataGrid-cell': {
              borderTop: '1px solid var(--hospital-gray-200)',
              color: 'var(--hospital-gray-900)',
              padding: '0.75rem 1.5rem',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'var(--hospital-gray-50)',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'var(--hospital-gray-50)',
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: 'var(--hospital-gray-50)',
              borderTop: '1px solid var(--hospital-gray-200)',
            },
            '& .MuiDataGrid-overlay': {
              backgroundColor: 'var(--hospital-white)',
            },
          }}
          components={{
            NoRowsOverlay: () => (
              <Box className="flex justify-center items-center h-full text-[var(--hospital-gray-500)]">
                {loading ? (
                  <div className="loading-spinner"></div>
                ) : (
                  'No inventory items found'
                )}
              </Box>
            ),
          }}
        />
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className="dropdown-menu"
      >
        <MenuItem onClick={handleDelete} className="dropdown-item" disabled={deleteLoading}>
          <Trash2 className="h-4 w-4 mr-2" />
          {deleteLoading ? 'Deleting...' : 'Delete'}
        </MenuItem>
      </Menu>
    </div>
  );
}