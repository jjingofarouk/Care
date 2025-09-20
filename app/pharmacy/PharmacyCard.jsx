import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import styles from './PharmacyCard.module.css';

const PharmacyCard = ({ prescription }) => {
  return (
    <Card className={styles.card} elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {prescription.patient?.name || 'N/A'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Prescription ID: {prescription.id}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Medications: {prescription.items?.map(item => item.medication?.name || 'N/A').join(', ') || 'None'}
        </Typography>
        <Box mt={1}>
          <Chip 
            label={prescription.status || 'Unknown'} 
            color={prescription.status === 'Filled' ? 'success' : 'default'}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="textSecondary">
          Date: {prescription.prescriptionDate ? new Date(prescription.prescriptionDate).toLocaleDateString() : 'N/A'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PharmacyCard;