// app/adt/analytics/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { BarChart2 } from 'lucide-react';
import LineChart from '../../components/adt/charts/LineChart';
import BarChart from '../../components/adt/charts/BarChart';
import DoughnutChart from '../../components/adt/charts/DoughnutChart';
import adtService from '../../services/adtService';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    admissionsByDate: [],
    dischargesByWard: [],
    transfersByDate: [],
    occupancyByWard: [],
    stats: { totalAdmissions: 0, totalDischargesThisMonth: 0, totalBeds: 0, availableBeds: 0 },
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await adtService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <BarChart2 size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
        ADT Analytics
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Current Admissions</Typography>
              <Typography variant="h4">{analytics.stats.totalAdmissions}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Discharges (30 Days)</Typography>
              <Typography variant="h4">{analytics.stats.totalDischargesThisMonth}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Beds</Typography>
              <Typography variant="h4">{analytics.stats.totalBeds}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Available Beds</Typography>
              <Typography variant="h4">{analytics.stats.availableBeds}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <LineChart data={analytics.admissionsByDate} title="Admissions Over Time" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <DoughnutChart data={analytics.occupancyByWard} title="Occupancy Rate by Ward" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <LineChart data={analytics.transfersByDate} title="Transfers Trend" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <BarChart data={analytics.dischargesByWard} title="Discharges per Ward" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}