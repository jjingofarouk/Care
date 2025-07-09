import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import './tailwind.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
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
              maxWidth: '100%', 
              boxSizing: 'border-box',
              overflowX: 'hidden'
            }}
          >
            {children}
          </Box>
        </Box>
      </body>
    </html>
  );
}