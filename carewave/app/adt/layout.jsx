'use client';
import React from 'react';
// app/adt/layout.js

import { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Hospital, Bed, ArrowLeftRight, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdtLayout({ children }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(true);

  const menuItems = [
    { text: 'Admissions', path: '/adt/admissions', icon: <Hospital size={20} /> },
    { text: 'Discharges', path: '/adt/discharges', icon: <Bed size={20} /> },
    { text: 'Transfers', path: '/adt/transfers', icon: <ArrowLeftRight size={20} /> },
    { text: 'Analytics', path: '/adt/analytics', icon: <BarChart2 size={20} /> },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', bgcolor: '#f5f5f5' },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            ADT Module
          </Typography>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  selected={pathname === item.path}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: drawerOpen ? 0 : -30 }}>
        {children}
      </Box>
    </Box>
  );
}