'use client';

import React, { useState, useEffect } from 'react';
import { assetsService } from '../../services/assetsService';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Calendar, FileText } from 'lucide-react';

export default function AssetAnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalAssets: 0,
    totalCost: 0,
    totalDepreciation: 0,
    assetsByYear: [],
    depreciationByYear: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    const data = await assetsService.getAnalytics();
    setAnalytics(data);
    setLoading(false);
  };

  return (
    <div className="card w-full max-w-[100vw] mx-0 p-0">
      <div className="card-header px-2 py-1">
        <h2 className="card-title text-lg">
          {loading ? <Skeleton width={200} height={24} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Asset Analytics'}
        </h2>
      </div>
      <div className="p-2 space-y-4">
        {loading ? (
          <Skeleton count={3} height={100} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-2">
                <FileText size={20} />
                <h3 className="text-md font-semibold">Total Assets</h3>
              </div>
              <p className="text-2xl font-bold">{analytics.totalAssets}</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2">
                <DollarSign size={20} />
                <h3 className="text-md font-semibold">Total Cost</h3>
              </div>
              <p className="text-2xl font-bold">${analytics.totalCost.toFixed(2)}</p>
            </div>
            <div className="card p-4">
              <div className="flex items-center gap-2">
                <DollarSign size={20} />
                <h3 className="text-md font-semibold">Total Depreciation</h3>
              </div>
              <p className="text-2xl font-bold">${analytics.totalDepreciation.toFixed(2)}</p>
            </div>
          </div>
        )}
        <div className="space-y-4">
          <h3 className="text-md font-semibold">
            {loading ? <Skeleton width={200} height={20} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Assets by Purchase Year'}
          </h3>
          <div className="h-[300px] w-full">
            {loading ? (
              <Skeleton height={300} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.assetsByYear}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} assets`} />
                  <Legend />
                  <Bar dataKey="count" fill="var(--hospital-accent)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-md font-semibold">
            {loading ? <Skeleton width={200} height={20} baseColor="#e5e7eb" highlightColor="#f3f4f6" /> : 'Depreciation by Year'}
          </h3>
          <div className="h-[300px] w-full">
            {loading ? (
              <Skeleton height={300} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.depreciationByYear}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Legend />
                  <Bar dataKey="amount" fill="var(--hospital-accent)" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}