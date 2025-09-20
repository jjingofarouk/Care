'use client';
import React, { useState, useEffect } from 'react';
import pharmacyService from '../../services/pharmacyService';
import PrescriptionForm from '../../components/pharmacy/PrescriptionForm';
import PrescriptionList from '../../components/pharmacy/PrescriptionList';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [drugs, setDrugs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prescriptionData, patientData, doctorData, drugData] = await Promise.all([
          pharmacyService.getPrescriptions(),
          pharmacyService.getPatients(),
          pharmacyService.getDoctors(),
          pharmacyService.getAvailablePharmacyItems(),
        ]);
        setPrescriptions(prescriptionData);
        setPatients(patientData);
        setDoctors(doctorData);
        setDrugs(drugData.map(item => item.drug));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full p-2">
      <PrescriptionForm patients={patients} doctors={doctors} drugs={drugs} />
      <PrescriptionList prescriptions={prescriptions} />
    </div>
  );
}