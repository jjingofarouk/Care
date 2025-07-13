'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import medicalRecordsService from '../../services/medicalRecordsService';
import MedicalRecordList from '../../components/medical-records/MedicalRecordList';
import MedicalRecordFilter from '../../components/medical-records/MedicalRecordFilter';
import MedicalRecordStats from '../../components/medical-records/MedicalRecordStats';

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    patientId: '',
    dateFrom: '',
    dateTo: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecords();
    fetchStats();
  }, [filters]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await medicalRecordsService.getAllMedicalRecords(filters);
      setRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await medicalRecordsService.getMedicalRecordStats(filters);
      setStats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDelete = async (id) => {
    try {
      await medicalRecordsService.deleteMedicalRecord(id);
      fetchRecords();
      fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medical Records Overview</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <MedicalRecordFilter onFilterChange={handleFilterChange} />
      
      {stats && <MedicalRecordStats stats={stats} />}
      
      {loading ? (
        <div>Loading...</div>
      ) : (
        <MedicalRecordList 
          records={records} 
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}