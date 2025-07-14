'use client';
import React from 'react';
import { format } from 'date-fns';

export default function PrescriptionList({ prescriptions }) {
  return (
    <div className="card w-full p-4">
      <div className="card-header">
        <h2 className="card-title">Prescriptions</h2>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Drug</th>
            <th>Dosage</th>
            <th>Prescribed At</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription) => (
            <tr key={prescription.id}>
              <td>{prescription.patient.user.name}</td>
              <td>{prescription.doctor.user.name}</td>
              <td>{prescription.drug.name}</td>
              <td>{prescription.dosage}</td>
              <td>{format(new Date(prescription.prescribedAt), 'PPp')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}