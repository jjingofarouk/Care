// medical-records/page.jsx
import React from 'react';
import MedicalRecordsList from './MedicalRecordsList';
import MedicalRecordsForm from './MedicalRecordsForm';

const MedicalRecordsPage = () => {
  return (
    <div>
      <h1>Medical Records Management</h1>
      <MedicalRecordsForm />
      <MedicalRecordsList />
    </div>
  );
};

export default MedicalRecordsPage;
