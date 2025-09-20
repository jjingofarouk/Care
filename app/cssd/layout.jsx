'use client';
import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';

export default function CssdLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" component="div">
            CSSD Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4, width: '100%', maxWidth: '100%' }}>
        {children}
      </Container>
    </div>
  );
}