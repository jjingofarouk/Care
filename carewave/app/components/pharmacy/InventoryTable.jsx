'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Search, Plus, Edit, Delete, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function InventoryTable({ inventory: initialInventory = [], loading: initialLoading = false, onInventoryItemDeleted }) {
  const router = useRouter();
  const [inventory, setInventory] = useState(initialInventory);
  const [loading, setLoading] = useState(initialLoading);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!initialInventory.length) {
      fetchInventory();
    }
  }, [search, initialInventory]);

  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/pharmacy/inventory?search=${encodeURIComponent(search)}`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch inventory: ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('API response is not an array');
      }

      const validatedInventory = data.map((item) => ({
        id: item.id || '',
        drug: item.drug || { name: '' },
        batchNumber: item.batchNumber || '',
        expiryDate: item.expiryDate || '',
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
        createdAt: item.createdAt || '',
        updatedAt: item.updatedAt || '',
      })).filter(Boolean);

      setInventory(validatedInventory);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
      setError(err.message);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  };

  const handleDelete = async (id) => {
    if (!id || !window.confirm('Are you sure you want to delete this inventory item?')) return;

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/pharmacy/inventory?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete item: ${response.status}`);
      }

      if (onInventoryItemDeleted) {
        onInventoryItemDeleted(id);
      } else {
        setInventory((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete inventory item:', err);
      alert(`Failed to delete item: ${err.message}`);
    }
  };

  const getStockStatus = (quantity, expiryDate) => {
    const isExpired = expiryDate && new Date(expiryDate) < new Date();
    if (isExpired) return <span className="badge badge-error">Expired</span>;
    if (quantity <= 10) return <span className="badge badge-warning">Low Stock</span>;
    return <span className="badge badge-success">In Stock</span>;
  };

  const columns = [
    {
      field: 'drugName',
      headerName: 'Drug',
      minWidth: 200,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) => params.row.drug?.name || '-',
    },
    {
      field: 'batchNumber',
      headerName: 'Batch Number',
      minWidth: 150,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      minWidth: 150,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) =>
        params.row.expiryDate ? format(new Date(params.row.expiryDate), 'PP') : '-',
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      minWidth: 100,
      type: 'number',
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
    },
    {
      field: 'unitPrice',
      headerName: 'Unit Price',
      minWidth: 120,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) =>
        params.row.unitPrice ? `$${params.row.unitPrice.toFixed(2)}` : '-',
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      sortable: false,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) => getStockStatus(params.row.quantity, params.row.expiryDate),
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      minWidth: 180,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) =>
        params.row.updatedAt ? format(new Date(params.row.updatedAt), 'PPp') : '-',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 150,
      sortable: false,
      filterable: false,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) => (
        <div className="flex gap-1">
          <button
            className="btn btn-outline !p-2"
            onClick={() => router.push(`/pharmacy/inventory/${params.row.id}`)}
            title="View Item"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="btn btn-outline !p-2"
            onClick={() => router.push(`/pharmacy/inventory/new?id=${params.row.id}`)}
            title="Edit Item"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="btn btn-outline !p-2 text-[var(--hospital-error)] border-[var(--hospital-error)] hover:bg-[var(--hospital-error)] hover:text-[var(--hospital-white)]"
            onClick={() => handleDelete(params.row.id)}
            title="Delete Item"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="card max-w-[1280px] mx-auto w-full overflow-x-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-3">
        <h1 className="card-title">Pharmacy Inventory</h1>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/pharmacy/inventory/new')}
        >
          <Plus className="w-5 h-5" />
          New Item
        </button>
      </div>

      <div className="mb-3 max-w-md w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--hospital-gray-400)]" />
          <input
            type="text"
            placeholder="Search by drug or batch number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-3">
          <span>Error: {error}</span>
          <button className="btn btn-outline" onClick={fetchInventory}>
            Retry
          </button>
        </div>
      )}

      <div className="table w-[1200px] min-w-full">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="loading-spinner" />
          </div>
        ) : (
          <DataGrid
            rows={inventory}
            columns={columns}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10, 25, 50]}
            autoHeight
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            classes={{
              root: 'table bg-[var(--hospital-white)] rounded-lg shadow-[var(--shadow-sm)]',
              columnHeaders: 'bg-[var(--hospital-gray-50)]',
              row: 'hover:bg-[var(--hospital-gray-50)]',
              cell: 'py-2 px-4 text-[var(--hospital-gray-900)] border-t border-[var(--hospital-gray-200)]',
              footerContainer: 'bg-[var(--hospital-gray-50)] border-t border-[var(--hospital-gray-200)]',
            }}
            localeText={{ noRowsLabel: 'No inventory items found' }}
          />
        )}
      </div>
    </div>
  );
}