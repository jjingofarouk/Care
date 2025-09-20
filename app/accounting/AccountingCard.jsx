"use client";

import React from 'react';
import { Card, CardContent, CardActions, Typography, Chip, Button } from '@mui/material';
import styles from './AccountingCard.module.css';

export default function AccountingCard({ item, type }) {
  const renderContent = () => {
    switch (type) {
      case 'transaction':
        return (
          <>
            <Typography variant="h6" className={styles.title}>
              {item.description || 'No Description'}
            </Typography>
            <Chip
              label={item.status || 'UNKNOWN'}
              className={`${styles.status} ${
                item.status === 'PAID' ? styles.paid : item.status === 'OVERDUE' ? styles.overdue : styles.pending
              }`}
            />
            <Typography variant="body2">
              <strong>Amount:</strong> ${item.amount?.toFixed(2) || '0.00'}
            </Typography>
            <Typography variant="body2">
              <strong>Date:</strong> {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Category:</strong> {item.category || 'N/A'}
            </Typography>
            {item.costCenter && (
              <Typography variant="body2">
                <strong>Cost Center:</strong> {item.costCenter.name || 'N/A'}
              </Typography>
            )}
          </>
        );
      case 'payroll':
        return (
          <>
            <Typography variant="h6" className={styles.title}>
              {(item.user && item.user.name ? item.user.name : 'Unknown User') + ' - ' + (item.period || 'No Period')}
            </Typography>
            <Chip
              label={item.status || 'UNKNOWN'}
              className={`${styles.status} ${
                item.status === 'PAID' ? styles.paid : item.status === 'OVERDUE' ? styles.overdue : styles.pending
              }`}
            />
            <Typography variant="body2">
              <strong>Salary:</strong> ${item.salary?.toFixed(2) || '0.00'}
            </Typography>
            <Typography variant="body2">
              <strong>Taxes:</strong> ${item.taxes?.toFixed(2) || '0.00'}
            </Typography>
            <Typography variant="body2">
              <strong>Benefits:</strong> ${item.benefits?.toFixed(2) || '0.00'}
            </Typography>
          </>
        );
      case 'asset':
        return (
          <>
            <Typography variant="h6" className={styles.title}>
              {item.name || 'No Name'}
            </Typography>
            <Chip
              label={item.status || 'UNKNOWN'}
              className={`${styles.status} ${
                item.status === 'ACTIVE' ? styles.paid : item.status === 'OVERDUE' ? styles.overdue : styles.pending
              }`}
            />
            <Typography variant="body2">
              <strong>Purchase Cost:</strong> ${item.purchaseCost?.toFixed(2) || '0.00'}
            </Typography>
            <Typography variant="body2">
              <strong>Current Value:</strong> ${item.currentValue?.toFixed(2) || '0.00'}
            </Typography>
            <Typography variant="body2">
              <strong>Purchase Date:</strong> {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}
            </Typography>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={styles.card}>
      <CardContent className={styles.header}>{renderContent()}</CardContent>
      <CardActions className={styles.footer}>
        <Button variant="contained" className={styles.button}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}