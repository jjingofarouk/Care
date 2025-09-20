'use client';

import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useAuth } from '@/auth/AuthContext';
import { useRouter } from 'next/navigation';

export default function AccessDenied() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        }}
      >
        <CircularProgress sx={{ color: '#ffffff' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        padding: 2,
      }}
    >
      <Box
        sx={{
          borderRadius: 4,
          maxWidth: 480,
          width: '100%',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant='h4' sx={{ color: '#1e3a8a', mb: 2 }}>
          Access Denied
        </Typography>
        <Typography sx={{ color: '#374151', mb: 3 }}>
          You do not have permission to access this page.
        </Typography>
        <Button
          variant='contained'
          onClick={() => router.push(user ? '/dashboard' : '/auth/login')}
          sx={{
            borderRadius: 2,
            bgcolor: '#3b82f6',
            '&:hover': { bgcolor: '#2563eb' },
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          {user ? 'Go to Dashboard' : 'Go to Login'}
        </Button>
      </Box>
    </Box>
  );
}