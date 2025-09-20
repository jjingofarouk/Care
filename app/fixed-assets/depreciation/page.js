'use client';

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { assetsService } from '../../services/assetsService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function DepreciationSchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fixedAssetId: '',
    depreciationDate: '',
    amount: '',
  });
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
    fetchAssets();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    const data = await assetsService.getDepreciationSchedules();
    setSchedules(data);
    setLoading(false);
  };

  const fetchAssets = async () => {
    const data = await assetsService.getAssets();
    setAssets(data);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ fixedAssetId: '', depreciationDate: '', amount: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await assetsService.createDepreciationSchedule(formData);
    await fetchSchedules();
    handleClose();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await assetsService.deleteDepreciationSchedule(id);
    await fetchSchedules();
    setLoading(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'fixedAssetId', headerName: 'Asset ID', width: 200 },
    { field: 'depreciationDate', headerName: 'Depreciation Date', width: 150, type: 'date', valueGetter: ({ value }) => new Date(value) },
    { field: 'amount', headerName: 'Amount', width: 150, type: 'number', valueFormatter: ({ value }) => `$${value.toFixed(2)}` },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div className="flex gap-2">
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
          {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Depreciation Schedules'}
        </h2>
      </div>
      <div className="p-2">
        {loading ? (
          <Skeleton width={150} height={36} baseColor="#e5e7eb" highlightColor="#f3f4f6" className="mb-2" />
        ) : (
          <button onClick={handleOpen} className="btn btn-primary mb-2 flex items-center gap-2">
            <PlusCircle size={16} /> Add Depreciation Schedule
          </button>
        )}
        <div className="h-[400px] w-full">
          {loading ? (
            <Skeleton count={5} height={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
          ) : (
            <DataGrid rows={schedules} columns={columns} pageSize={5} />
          )}
        </div>
        {open && (
          <div className="fixed inset-0 bg-hospital-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="card max-w-md w-full mx-2 p-0">
              <div className="card-header px-2 py-1">
                <h2 className="card-title text-lg">
                  {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Add Depreciation Schedule'}
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
                    <select
                      value={formData.fixedAssetId}
                      onChange={(e) => setFormData({ ...formData, fixedAssetId: e.target.value })}
                      className="select w-full"
                    >
                      <option value="">Select Asset</option>
                      {assets.map((asset) => (
                        <option key={asset.id} value={asset.id}>{asset.name}</option>
                      ))}
                    </select>
                    <input
                      type="date"
                      placeholder="Depreciation Date"
                      value={formData.depreciationDate}
                      onChange={(e) => setFormData({ ...formData, depreciationDate: e.target.value })}
                      className="input w-full"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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