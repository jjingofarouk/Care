'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import pharmacyService from '../../../services/pharmacyService';
import PrescriptionForm from '../../../components/pharmacy/PrescriptionForm';

export default function PrescriptionDetailPage() {
  const { id } = useParams();
  const [prescription, setPrescription] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [drugs, setDrugs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prescriptionData, patientData, doctorData, drugData] = await Promise.all([
          pharmacyService.getPrescriptions({ id }),
          pharmacyService.getPatients(),
          pharmacyService.getDoctors(),
          pharmacyService.getAvailablePharmacyItems(),
        ]);
        setPrescription(prescriptionData[0]);
        setPatients(patientData);
        setDoctors(doctorData);
        setDrugs(drugData.map(item => item.drug));
      } catch (error) {
        console.error('Error fetching prescription data:', error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="w-full p-2">
      {prescription ? (
        <PrescriptionForm
          patients={patients}
          doctors={doctors}
          drugs={drugs}
          initialData={prescription}
        />
      ) : (
        <div className="card w-full p-4">
          <div className="skeleton-text" />
          <div className="skeleton-text" />
        </div>
      )}
    </div>
  );
}