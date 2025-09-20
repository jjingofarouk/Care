"use client";

import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import AccountingForm from './AccountingForm';
import AccountingList from './AccountingList';
import styles from './AccountingPage.module.css';

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState('transaction');

  const handleFormSubmit = () => {
    // Trigger list refresh
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.title}>
        Accounting
      </Typography>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        className={styles.tabs}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Transactions" value="transaction" className={styles.tab} />
        <Tab label="Payroll" value="payroll" className={styles.tab} />
        <Tab label="Assets" value="asset" className={styles.tab} />
      </Tabs>
      <AccountingForm onSubmit={handleFormSubmit} type={activeTab} />
      <AccountingList type={activeTab} />
    </Box>
  );
}