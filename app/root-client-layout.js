// app/root-client-layout.tsx
'use client';

import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '@/auth/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary';

export default function RootClientLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading: loadingAuth } = useAuth(); // eslint-disable-line no-unused-vars

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ErrorBoundary>
      {loadingAuth ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header toggleSidebar={toggleSidebar} />
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              mt: 8,
              ml: { xs: 0, md: isSidebarOpen ? 31.0 : 0 },
              transition: 'margin-left 0.3s ease',
            }}
          >
            {children}
          </Box>
        </Box>
      )}
    </ErrorBoundary>
  );
}