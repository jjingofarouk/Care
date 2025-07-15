'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { assetsService } from '../../services/assetsService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DataGrid } from '@mui/x-data-grid';
import { Calendar, DollarSign, FileText } from 'lucide-react';

export default function AssetDetailsPage() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAsset();
  }, [id]);

  const fetchAsset = async () => {
    setLoading(true);
    const data = await assetsService.getAsset(id);
    setAsset(data);
    setLoading(false);
  };

  const depreciationColumns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'depreciationDate', headerName: 'Depreciation Date', width: 150, type: 'date', valueGetter: ({ value }) => new Date(value) },
    { field: 'amount', headerName: 'Amount', width: 150, type: 'number', valueFormatter: ({ value }) => `$${value.toFixed(2)}` },
  ];

  const auditColumns = [
    { field: 'id', headerName: 'ID', width: 200 },
    { field: 'auditDate', headerName: 'Audit Date', width: 150, type: 'date', valueGetter: ({ value }) => new Date(value) },
    { field: 'findings', headerName: 'Findings', width: 300 },
  ];

  return (
    <div className="card w-full max-w-[100vw] mx-0 p-0">
      <div className="card-header px-2 py-1">
        <h2 className="card-title text-lg">
          {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Asset Details'}
        </h2>
      </div>
      <div className="p-2 space-y-4">
        {loading ? (
          <Skeleton count={3} height={40} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
        ) : (
          asset && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText size={20} />
                <p><strong>Name:</strong> {asset.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} />
                <p><strong>Purchase Date:</strong> {new Date(asset.purchaseDate).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={20} />
                <p><strong>Cost:</strong> ${asset.cost.toFixed(2)}</p>
              </div>
            </div>
          )
        )}
        <div>
          <h3 className="text-md font-semibold mb-2">
            {loading ? <Skeleton width={150} height={20} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Depreciation Schedules'}
          </h3>
          <div className="h-[300px] w-full">
            {loading ? (
              <Skeleton count={4} height={60} baseColor="#e5e7eb" highlightColor="#f3f4f6"

 />
            ) : (
              <DataGrid rows={asset?.depreciationSchedules || []} columns={depreciationColumns} pageSize={5} />
            )}
          </div>
        </div>
        <div>
          <h3 className="text-md font-semibold mb-2">
            {loading ? <Skeleton width={150} height={20} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Asset Audits'}
          </h3>
          <div className="h-[300px] w-full">
            {loading ? (
              <Skeleton count={4} height={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
            ) : (
              <DataGrid rows={asset?.assetAudits || []} columns={auditColumns} pageSize={5} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}