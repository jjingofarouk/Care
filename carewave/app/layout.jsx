'use client';

import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import { AuthProvider } from './auth/AuthContext';
import './globals.css';

export default function RootLayout({ children }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then(reg => console.log('✅ Service Worker registered:', reg.scope))
          .catch(err => console.error('❌ Service Worker registration failed:', err));
      });
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/icons/icon-512x512.png" sizes="512x512" />
      </head>
      <body style={{ margin: 0 }}>
        <AuthProvider>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              m: 0,
            }}
          >
            <Header />
            <Box
              component="main"
              sx={{
                flex: 1,
                m: 0,
                pt: { xs: '64px', sm: '80px', lg: '96px' },
                maxWidth: '100%',
                boxSizing: 'border-box',
                overflowX: 'hidden',
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