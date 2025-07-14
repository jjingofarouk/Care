'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  Grid, 
  Divider,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package, 
  Calendar, 
  Hash, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pill,
  Clock,
  Info
} from 'lucide-react';
import { format, isAfter, differenceInDays } from 'date-fns';

export default function InventoryItemPage({ params }) {
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [dispenseHistory, setDispenseHistory] = useState([]);

  useEffect(() => {
    fetchInventoryItem();
    fetchDispenseHistory();
  }, [params.id]);

  const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const fetchInventoryItem = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/pharmacy/inventory/${params.id}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Inventory item not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setItem(data);
    } catch (err) {
      console.error('Error fetching inventory item:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDispenseHistory = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`/api/pharmacy/dispense-records?pharmacyItemId=${params.id}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDispenseHistory(data);
      }
    } catch (err) {
      console.error('Error fetching dispense history:', err);
      // Don't set error state for dispense history failure
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this inventory item?')) return;

    setDeleteLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`/api/pharmacy/inventory/${params.id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      router.push('/inventory');
    } catch (err) {
      console.error('Error deleting inventory item:', err);
      alert('Failed to delete inventory item: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStockStatus = (quantity, expiryDate) => {
    const isExpired = new Date(expiryDate) < new Date();
    const daysUntilExpiry = differenceInDays(new Date(expiryDate), new Date());
    
    if (isExpired) {
      return { 
        label: 'Expired', 
        color: 'error', 
        icon: <XCircle className="h-4 w-4" />,
        severity: 'error'
      };
    }
    if (daysUntilExpiry <= 30) {
      return { 
        label: 'Expiring Soon', 
        color: 'warning', 
        icon: <AlertTriangle className="h-4 w-4" />,
        severity: 'warning'
      };
    }
    if (quantity <= 10) {
      return { 
        label: 'Low Stock', 
        color: 'warning', 
        icon: <AlertTriangle className="h-4 w-4" />,
        severity: 'warning'
      };
    }
    return { 
      label: 'In Stock', 
      color: 'success', 
      icon: <CheckCircle className="h-4 w-4" />,
      severity: 'success'
    };
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-[400px]">
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-4">
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => router.push('/inventory')}
        >
          Back to Inventory
        </Button>
      </Box>
    );
  }

  if (!item) {
    return (
      <Box className="p-4">
        <Alert severity="warning">
          Inventory item not found
        </Alert>
      </Box>
    );
  }

  const status = getStockStatus(item.quantity, item.expiryDate);
  const daysUntilExpiry = differenceInDays(new Date(item.expiryDate), new Date());

  return (
    <Box className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box className="flex items-center gap-4">
          <Button
            variant="outlined"
            startIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => router.push('/inventory')}
          >
            Back to Inventory
          </Button>
          <Typography variant="h4" className="font-semibold">
            Inventory Item Details
          </Typography>
        </Box>
        <Box className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<Edit className="h-4 w-4" />}
            onClick={() => router.push(`/inventory/${item.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Trash2 className="h-4 w-4" />}
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Box>
      </Box>

      {/* Status Alert */}
      {status.severity !== 'success' && (
        <Alert severity={status.severity} className="mb-4">
          <Box className="flex items-center gap-2">
            {status.icon}
            <Typography>
              {status.label}
              {daysUntilExpiry > 0 && daysUntilExpiry <= 30 && 
                ` - Expires in ${daysUntilExpiry} day${daysUntilExpiry === 1 ? '' : 's'}`
              }
            </Typography>
          </Box>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Item Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box className="space-y-4">
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" className="flex items-center gap-2">
                        <Pill className="h-4 w-4" />
                        Drug Name
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {item.drug?.name || 'N/A'}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Batch Number
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {item.batchNumber}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Quantity
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {item.quantity} units
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box className="space-y-4">
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Expiry Date
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {format(new Date(item.expiryDate), 'PPP')}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip 
                        label={status.label} 
                        color={status.color}
                        icon={status.icon}
                        className="mt-1"
                      />
                    </Box>
                    
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Days Until Expiry
                      </Typography>
                      <Typography variant="body1" className="font-medium">
                        {daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 'Expired'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timestamps
              </Typography>
              
              <Box className="space-y-3">
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(item.createdAt), 'PPp')}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(item.updatedAt), 'PPp')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Drug Information */}
          {item.drug?.description && (
            <Card className="mt-3">
              <CardContent>
                <Typography variant="h6" className="mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Drug Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.drug.description}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Dispense History */}
        {dispenseHistory.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Dispense History
                </Typography>
                <List>
                  {dispenseHistory.map((record, index) => (
                    <React.Fragment key={record.id}>
                      <ListItem>
                        <ListItemIcon>
                          <Package className="h-4 w-4" />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${record.quantity} units dispensed to ${record.patient?.name || 'Unknown Patient'}`}
                          secondary={`Dispensed on ${format(new Date(record.dispensedAt), 'PPp')}`}
                        />
                      </ListItem>
                      {index < dispenseHistory.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}