"use client";

import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import styles from './DashboardWidget.module.css';

export default function DashboardWidget({ title, value }) {
  return (
    <Card className={styles.widget}>
      <CardContent>
        <Typography variant="h6" className={styles.title}>
          {title}
        </Typography>
        <Typography variant="h4" className={styles.value}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}