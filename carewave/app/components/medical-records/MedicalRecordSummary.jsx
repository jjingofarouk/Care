import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Calendar, User, Heart } from 'lucide-react';

const MedicalRecordSummary = ({ record }) => {
  return (
    <Box className="card p-6">
      <Typography variant="h6" className="card-title mb-4">Medical Record Summary</Typography>
      <Box className="flex flex-col gap-4">
        <Box className="flex items-center gap-2">
          <User className="h-5 w-5 text-hospital-gray-500" />
          <Typography variant="body1">
            <strong>Patient:</strong> {record.patient?.name || 'N/A'}
          </Typography>
        </Box>
        <Box className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-hospital-gray-500" />
          <Typography variant="body1">
            <strong>Record Date:</strong> {new Date(record.recordDate).toLocaleDateString()}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" className="mb-2">
            <strong>Allergies:</strong>
          </Typography>
          <Box className="flex flex-wrap gap-2">
            {record.allergies?.length > 0 ? (
              record.allergies.map((allergy) => (
                <Chip
                  key={allergy.id}
                  label={`${allergy.name} (${allergy.severity})`}
                  className="badge-error"
                />
              ))
            ) : (
              <Typography variant="body2" className="text-hospital-gray-500">
                No allergies recorded
              </Typography>
            )}
          </Box>
        </Box>
        <Box>
          <Typography variant="body1" className="mb-2">
            <strong>Diagnoses:</strong>
          </Typography>
          <Box className="flex flex-wrap gap-2">
            {record.diagnoses?.length > 0 ? (
              record.diagnoses.map((diagnosis) => (
                <Chip
                  key={diagnosis.id}
                  label={diagnosis.code}
                  className="badge-info"
                />
              ))
            ) : (
              <Typography variant="body2" className="text-hospital-gray-500">
                No diagnoses recorded
              </Typography>
            )}
          </Box>
        </Box>
        <Box>
          <Typography variant="body1" className="mb-2">
            <strong>Latest Vital Signs:</strong>
          </Typography>
          {record.vitalSigns?.length > 0 ? (
            <Box className="flex flex-col gap-2">
              <Typography variant="body2">
                Blood Pressure: {record.vitalSigns[0].bloodPressure || 'N/A'}
              </Typography>
              <Typography variant="body2">
                Heart Rate: {record.vitalSigns[0].heartRate || 'N/A'} bpm
              </Typography>
              <Typography variant="body2">
                Temperature: {record.vitalSigns[0].temperature || 'N/A'} °C
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" className="text-hospital-gray-500">
              No vital signs recorded
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MedicalRecordSummary;