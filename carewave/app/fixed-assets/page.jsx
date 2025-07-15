'use client';

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { assetsService } from '../services/assetsService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function FixedAssetsPage() {
  const [assets, setAssets] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    purchaseDate: '',
    cost: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setLoading(true);
    const data = await assetsService.getAssets();
    setAssets(data);
    setLoading(false);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', purchaseDate: '', cost: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await assetsService.createAsset(formData);
    await fetchAssets();
    handleClose();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await assetsService.deleteAsset(id);
    await fetchAssets();
    setLoading(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'name', headerName: 'Asset Name', width: 200 },
    { field: 'purchaseDate', headerName: 'Purchase Date', width: 150, type: 'date', valueGetter: ({ value }) => new Date(value) },
    { field: 'cost', headerName: 'Cost', width: 150, type: 'number', valueFormatter: ({ value }) => `$${value.toFixed(2)}` },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2">
          <a href={`/fixed-assets/${params.row.id}`} className="btn btn-primary flex items-center gap-2">
            View
          </a>
          <button onClick={() => handleDelete(params.row.id)} className="btn btn-danger flex items-center gap-2">
            <Trash2 size={16} /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="card w-full max-w-[100vw] mx-0 p-0">
      <div className="card-header px-2 py-1">
        <h2 className="card-title text-lg">
          {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Fixed Assets'}
        </h2>
      </div>
      <div className="p-2">
        {loading ? (
          <Skeleton width={150} height={36} baseColor="#e5e7eb" highlightColor="#f3f4f6" className="mb-2" />
        ) : (
          <button onClick={handleOpen} className="btn btn-primary mb-2 flex items-center gap-2">
            <PlusCircle size={16} /> Add Asset
          </button>
        )}
        <div className="h-[400px] w-full">
          {loading ? (
            <Skeleton count={5} height={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          ) : (
            <DataGrid rows={assets} columns={columns} pageSize={5} />
          )}
        </div>
        {open && (
          <div className="fixed inset-0 bg-hospital-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="card max-w-md w-full mx-2 p-0">
              <div className="card-header px-2 py-1">
                <h2 className="card-title text-lg">
                  {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Add Fixed Asset'}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-2 space-y-2">
                {loading ? (
                  <>
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Asset Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input w-full"
                    />
                    <input
                      type="date"
                      placeholder="Purchase Date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      className="input w-full"
                    />
                    <input
                      type="number"
                      placeholder="Cost"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      className="input w-full"
                    />
                  </>
                )}
                <div className="flex justify-end gap-2">
                  {loading ? (
                    <Skeleton width={100} height={36} count={2} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                  ) : (
                    <>
                      <button type="button" onClick={handleClose} className="btn btn-secondary">Cancel</button>
                      <button type="submit" className="btn btn-primary">Save</button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}