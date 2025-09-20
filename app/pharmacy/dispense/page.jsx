'use client';
import React, { useState, useEffect } from 'react';
import pharmacyService from '../../services/pharmacyService';
import DispenseForm from '../../components/pharmacy/DispenseForm';

export default function DispensePage() {
  const [patients, setPatients] = useState([]);
  const [pharmacyItems, setPharmacyItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData, itemData] = await Promise.all([
          pharmacyService.getPatients(),
          pharmacyService.getAvailablePharmacyItems(),
        ]);
        setPatients(patientData);
        setPharmacyItems(itemData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full p-2">
      <DispenseForm patients={patients} pharmacyItems={pharmacyItems} />
    </div>
  );
}