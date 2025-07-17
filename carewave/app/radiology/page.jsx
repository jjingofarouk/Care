// app/radiology/page.js
'use client';

import React, { useEffect, useState } from 'react';
import { getRadiologyTests, getImagingOrders, getRadiologyResults, getScanImages } from '@/services/radiologyService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, TestTube, FileText, Image } from 'lucide-react';

export default function RadiologyDashboard() {
  const [stats, setStats] = useState({
    tests: 0,
    orders: 0,
    results: 0,
    scanImages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [tests, orders, results, scanImages] = await Promise.all([
          getRadiologyTests(),
          getImagingOrders(),
          getRadiologyResults(),
          getScanImages(),
        ]);
        setStats({
          tests: tests.total,
          orders: orders.total,
          results: results.total,
          scanImages: scanImages.total,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-hospital-gray-900">Radiology Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Tests', value: stats.tests, icon: TestTube },
          { title: 'Total Orders', value: stats.orders, icon: FileText },
          { title: 'Total Results', value: stats.results, icon: FileText },
          { title: 'Total Scan Images', value: stats.scanImages, icon: Image },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-hospital-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <div className="skeleton h-8 w-20" /> : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
