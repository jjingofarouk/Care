import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import './tailwind.css'; // Import the global Tailwind CSS file

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh', 
          m: 0, 
          p: 0,
          pt: { xs: '64px', sm: '80px', lg: '96px' }
        }}>
          <Header />
          <Box 
            component="main" 
            sx={{ 
              flex: 1, 
              m: 0, 
              p: { xs: 2, sm: 3, lg: 4 }, 
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