'use client';
import React, { useState, useEffect } from 'react';
import { TextField, Button, Autocomplete, Alert, Skeleton, MenuItem } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import PharmacyCard from './PharmacyCard';
import { getPrescriptions, createPrescription, checkDrugInteractions, getDoctors, getPatients } from './pharmacyService';

const PharmacyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [newPrescription, setNewPrescription] = useState({
    patientId: '',
    doctorId: '',
    items: [],
  });
  const [doctorSearch, setDoctorSearch] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prescriptionData, doctorData, patientData] = await Promise.all([
          getPrescriptions(),
          getDoctors(),
          getPatients(),
        ]);
        setPrescriptions(prescriptionData);
        setDoctors(doctorData.map(d => ({
          id: d.id,
          name: d.user?.name || 'N/A',
          doctorId: d.doctorId || 'N/A',
          email: d.user?.email || 'N/A',
          specialty: d.specialty || 'N/A',
          licenseNumber: d.licenseNumber || 'N/A',
          phone: d.phone || 'N/A',
          office: d.office || 'N/A',
        })));
        setPatients(patientData.map(p => ({
          id: p.id,
          name: p.user?.name || 'N/A',
          patientId: p.patientId || 'N/A',
          email: p.user?.email || 'N/A',
          phone: p.phone || 'N/A',
          gender: p.gender || 'N/A',
          dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : 'N/A',
          bloodType: p.bloodType || 'N/A',
        })));
        setFilteredDoctors(doctorData);
        setFilteredPatients(patientData);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.details || error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filteredDocs = doctors.filter(doctor =>
      (doctor.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
       doctor.email.toLowerCase().includes(doctorSearch.toLowerCase()) ||
       doctor.doctorId.toLowerCase().includes(doctorSearch.toLowerCase())) &&
      (specialtyFilter ? doctor.specialty === specialtyFilter : true)
    );
    setFilteredDoctors(filteredDocs);

    const filteredPats = patients.filter(patient =>
      (patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
       patient.email.toLowerCase().includes(patientSearch.toLowerCase()) ||
       patient.patientId.toLowerCase().includes(patientSearch.toLowerCase())) &&
      (genderFilter ? patient.gender === genderFilter : true)
    );
    setFilteredPatients(filteredPats);
  }, [doctorSearch, patientSearch, specialtyFilter, genderFilter, doctors, patients]);

  const handleAddPrescription = async () => {
    try {
      const prescription = await createPrescription(newPrescription);
      setPrescriptions([...prescriptions, prescription]);
      setNewPrescription({ patientId: '', doctorId: '', items: [] });
      setDoctorSearch('');
      setPatientSearch('');
      setSpecialtyFilter('');
      setGenderFilter('');
      const medicationIds = newPrescription.items.map(item => item.medicationId);
      const interactionData = await checkDrugInteractions(medicationIds);
      setInteractions(interactionData);
      setError(null);
    } catch (error) {
      console.error('Error creating prescription:', error);
      setError(error.response?.data?.details || error.message);
    }
  };

  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))].filter(s => s !== 'N/A');
  const genders = [...new Set(patients.map(patient => patient.gender))].filter(g => g !== 'N/A');

  const CustomToolbar = () => (
    <div className="flex flex-wrap gap-4 p-4 bg-hospital-gray-50 dark:bg-hospital-gray-800">
      <TextField
        label="Search Doctor by Name, ID, or Email"
        variant="outlined"
        size="small"
        value={doctorSearch}
        onChange={(e) => setDoctorSearch(e.target.value)}
        className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md w-64"
      />
      <TextField
        label="Filter by Specialty"
        select
        variant="outlined"
        size="small"
        value={specialtyFilter}
        onChange={(e) => setSpecialtyFilter(e.target.value)}
        className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md w-48"
      >
        <MenuItem value="">All Specialties</MenuItem>
        {specialties.map(specialty => (
          <MenuItem key={specialty} value={specialty}>{specialty}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Search Patient by Name, ID, or Email"
        variant="outlined"
        size="small"
        value={patientSearch}
        onChange={(e) => setPatientSearch(e.target.value)}
        className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md w-64"
      />
      <TextField
        label="Filter by Gender"
        select
        variant="outlined"
        size="small"
        value={genderFilter}
        onChange={(e) => setGenderFilter(e.target.value)}
        className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md w-48"
      >
        <MenuItem value="">All Genders</MenuItem>
        {genders.map(gender => (
          <MenuItem key={gender} value={gender}>{gender}</MenuItem>
        ))}
      </TextField>
      <GridToolbarFilterButton className="text-hospital-gray-900 dark:text-hospital-white" />
    </div>
  );

  return (
    <div className="p-6 bg-hospital-white dark:bg-hospital-gray-900">
      <h2 className="text-lg font-semibold text-hospital-gray-900 dark:text-hospital-white mb-4">Prescription Management</h2>
      {error && (
        <div className="mb-4 p-3 bg-hospital-error/10 text-hospital-error border border-hospital-error/20 rounded-md">
          {error}
        </div>
      )}
      {loading ? (
        <div className="space-y-4">
          <Skeleton variant="rectangular" height={60} className="rounded-md" />
          <Skeleton variant="rectangular" height={400} className="rounded-md" />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 mb-4">
            <Autocomplete
              options={filteredDoctors}
              getOptionLabel={(option) => `${option.name} (${option.doctorId})`}
              onChange={(e, value) => setNewPrescription({ ...newPrescription, doctorId: value?.id || '' })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Doctor"
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md w-64"
                />
              )}
            />
            <Autocomplete
              options={filteredPatients}
              getOptionLabel={(option) => `${option.name} (${option.patientId})`}
              onChange={(e, value) => setNewPrescription({ ...newPrescription, patientId: value?.id || '' })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Patient"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="bg-hospital-gray-50 dark:bg-hospital-gray-800 text-hospital-gray-900 dark:text-hospital-white rounded-md w-64"
                />
              )}
            />
            <Button
              variant="contained"
              onClick={handleAddPrescription}
              className="bg-hospital-accent text-hospital-white hover:bg-hospital-teal-light transition-transform duration-fast ease-in-out transform hover:-translate-y-1 rounded-md px-4 py-2"
            >
              Create Prescription
            </Button>
          </div>
          <div className="space-y-4">
            <div className="bg-hospital-white dark:bg-hospital-gray-900 rounded-lg shadow-md">
              <DataGrid
                rows={filteredDoctors}
                columns={[
                  { field: 'id', headerName: 'ID', width: 90 },
                  { field: 'name', headerName: 'Name', width: 150 },
                  { field: 'doctorId', headerName: 'Doctor ID', width: 120 },
                  { field: 'email', headerName: 'Email', width: 180 },
                  { field: 'specialty', headerName: 'Specialty', width: 150 },
                  { field: 'licenseNumber', headerName: 'License Number', width: 150 },
                  { field: 'phone', headerName: 'Phone', width: 120 },
                  { field: 'office', headerName: 'Office', width: 120 },
                ]}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                className="text-hospital-gray-900 dark:text-hospital-white"
                slots={{ toolbar: CustomToolbar }}
              />
            </div>
            <div className="bg-hospital-white dark:bg-hospital-gray-900 rounded-lg shadow-md">
              <DataGrid
                rows={filteredPatients}
                columns={[
                  { field: 'id', headerName: 'ID', width: 90 },
                  { field: 'patientId', headerName: 'Patient ID', width: 120 },
                  { field: 'name', headerName: 'Name', width: 150 },
                  { field: 'email', headerName: 'Email', width: 180 },
                  { field: 'phone', headerName: 'Phone', width: 150 },
                  { field: 'gender', headerName: 'Gender', width: 100 },
                  { field: 'dateOfBirth', headerName: 'Date of Birth', width: 150 },
                  { field: 'bloodType', headerName: 'Blood Type', width: 120 },
                ]}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                className="text-hospital-gray-900 dark:text-hospital-white"
                slots={{ toolbar: CustomToolbar }}
              />
            </div>
          </div>
          <div className="space-y-4 mt-4">
            {prescriptions.map((prescription) => (
              <PharmacyCard key={prescription.id} prescription={prescription} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PharmacyPrescriptions;