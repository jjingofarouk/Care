import React from 'react';
import { Box } from '@mui/material';
import Header from './components/Header';
import { AuthProvider } from './auth/AuthContext';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <AuthProvider>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh', 
            m: 0,
          }}>
            <Header />
            <Box 
              component="main" 
              sx={{ 
                flex: 1, 
                m: 0,
                pt: { xs: '64px', sm: '80px', lg: '96px' },
                maxWidth: '100%', 
                boxSizing: 'border-box',
                overflowX: 'hidden'
              }}
            >
              {children}
            </Box>
          </Box>
        </AuthProvider>
      </body>
    </html>
  );
}