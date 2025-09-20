// DoctorCard.js
'use client';
import React from 'react';
import { Card, CardContent, Typography, Chip, Avatar, Box, Button } from '@mui/material';
import styles from './DoctorCard.module.css';


const DoctorCard = ({ doctor, onEdit, onSelect, onDelete }) => {
  const handleViewDetails = () => {
    try {
      onSelect(doctor.id);
    } catch (error) {
      console.error('Error selecting doctor:', error);
    }
  };

  return (
    <Card className={styles.card}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar src={doctor.photo || '/default-avatar.png'}>
            {doctor.user.name[0]}
          </Avatar>
          <Box ml={2}>
            <Typography variant="h6">{doctor.user.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {doctor.designation} - {doctor.specialty}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2">
          <strong>Department:</strong> {doctor.department}
        </Typography>
        <Typography variant="body2">
          <strong>Ward:</strong> {doctor.ward}
        </Typography>
        <Typography variant="body2">
          <strong>Email:</strong> {doctor.user.email}
        </Typography>
        <Typography variant="body2">
          <strong>Phone:</strong> {doctor.phone}
        </Typography>
        <Typography variant="body2">
          <strong>Status:</strong>
          <Chip
            label={doctor.availabilityStatus}
            color={doctor.availabilityStatus === 'AVAILABLE' ? 'success' : 'error'}
            size="small"
          />
        </Typography>
        <Box mt={2} display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onEdit(doctor)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => onDelete(doctor.id)}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;