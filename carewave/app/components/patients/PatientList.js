// components/patients/PatientList.js
"use client";

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Search, Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/patients?search=${encodeURIComponent(search)}&include=addresses,nextOfKin,insuranceInfo`);
      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!Array.isArray(data)) {
        throw new Error('API response is not an array');
      }
      
      const validatedPatients = data.map((patient) => {
        if (!patient || typeof patient !== 'object') {
          console.warn('Invalid patient data:', patient);
          return null;
        }
        
        const primaryAddress = patient.addresses?.[0];
        
        return {
          id: patient.id || '',
          firstName: patient.firstName || '',
          lastName: patient.lastName || '',
          email: patient.email || '',
          dateOfBirth: patient.dateOfBirth || '',
          gender: patient.gender || '',
          phone: patient.phone || '',
          createdAt: patient.createdAt || '',
          updatedAt: patient.updatedAt || '',
          userId: patient.userId || null,
          address: primaryAddress ? {
            street: primaryAddress.street || '',
            city: primaryAddress.city || '',
            country: primaryAddress.country || '',
            postalCode: primaryAddress.postalCode || ''
          } : null,
          nextOfKin: patient.nextOfKin ? {
            name: `${patient.nextOfKin.firstName || ''} ${patient.nextOfKin.lastName || ''}`.trim(),
            relationship: patient.nextOfKin.relationship || '',
            phone: patient.nextOfKin.phone || '',
            email: patient.nextOfKin.email || ''
          } : null,
          insurance: patient.insuranceInfo ? {
            provider: patient.insuranceInfo.provider || '',
            policyNumber: patient.insuranceInfo.policyNumber || '',
            expiryDate: patient.insuranceInfo.expiryDate || null
          } : null
        };
      }).filter(Boolean);
      
      setPatients(validatedPatients);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
      setError(error.message);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.warn('No patient ID provided for deletion');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        const response = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Failed to delete patient: ${response.status}`);
        }
        
        setPatients(prevPatients => prevPatients.filter(patient => patient.id !== id));
      } catch (error) {
        console.error('Failed to delete patient:', error);
        alert(`Failed to delete patient: ${error.message}`);
      }
    }
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '-';
    
    try {
      const dob = new Date(dateOfBirth);
      if (isNaN(dob.getTime())) return '-';
      
      const today = new Date();
      const age = Math.floor((today - dob) / (365.25 * 24 * 60 * 60 * 1000));
      return age >= 0 ? age : '-';
    } catch (error) {
      console.warn('Error calculating age:', error);
      return '-';
    }
  };

  const formatAddress = (address) => {
    if (!address) return '-';
    
    const parts = [
      address.street,
      address.city,
      address.country
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : '-';
  };

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 120,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell'
    },
    { 
      field: 'firstName', 
      headerName: 'First Name', 
      width: 130,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell'
    },
    { 
      field: 'lastName', 
      headerName: 'Last Name', 
      width: 130,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell'
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 180,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell'
    },
    {
      field: 'age',
      headerName: 'Age',
      width: 80,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      valueGetter: (params) => calculateAge(params?.row?.dateOfBirth),
    },
    { 
      field: 'gender', 
      headerName: 'Gender', 
      width: 100,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell'
    },
    { 
      field: 'phone', 
      headerName: 'Phone', 
      width: 130,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell'
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 200,
      sortable: false,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-700)] text-sm">{formatAddress(params?.row?.address)}</span>
      ),
    },
    {
      field: 'nextOfKin',
      headerName: 'Next of Kin',
      width: 150,
      sortable: false,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) => {
        const nextOfKin = params?.row?.nextOfKin;
        
        if (!nextOfKin || !nextOfKin.name) {
          return <span className="text-[var(--hospital-gray-500)] text-sm">-</span>;
        }
        
        return (
          <div className="flex flex-col">
            <span className="font-medium text-[var(--hospital-gray-900)] text-sm">{nextOfKin.name}</span>
            <span className="text-[var(--hospital-gray-600)] text-xs">{nextOfKin.relationship}</span>
          </div>
        );
      },
    },
    {
      field: 'insurance',
      headerName: 'Insurance',
      width: 150,
      sortable: false,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) => {
        const insurance = params?.row?.insurance;
        
        if (!insurance || !insurance.provider) {
          return <span className="text-[var(--hospital-gray-500)] text-sm">-</span>;
        }
        
        const isExpired = insurance.expiryDate && new Date(insurance.expiryDate) < new Date();
        
        return (
          <div className="flex flex-col">
            <span className="font-medium text-[var(--hospital-gray-900)] text-sm">{insurance.provider}</span>
            <span className="text-[var(--hospital-gray-600)] text-xs">{insurance.policyNumber}</span>
            {isExpired && (
              <span className="badge badge-error mt-1">Expired</span>
            )}
          </div>
        );
      },
    },
    {
      field: 'hasUserAccount',
      headerName: 'User Account',
      width: 120,
      sortable: true,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) => {
        const hasAccount = !!params?.row?.userId;
        
        return (
          <span className={`badge ${hasAccount ? 'badge-success' : 'badge-neutral'}`}>
            {hasAccount ? 'Yes' : 'No'}
          </span>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      headerClassName: 'table-header',
      cellClassName: 'table-cell',
      renderCell: (params) => {
        const patientId = params?.row?.id;
        
        if (!patientId) return null;
        
        return (
          <div className="flex gap-1">
            <button
              className="btn btn-outline !p-2"
              onClick={() => router.push(`/patients/${patientId}`)}
              title="View Patient"
            >
              <Visibility className="w-4 h-4" />
            </button>
            <button
              className="btn btn-outline !p-2"
              onClick={() => router.push(`/patients/edit/${patientId}`)}
              title="Edit Patient"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              className="btn btn-outline !p-2 text-[var(--hospital-error)] border-[var(--hospital-error)] hover:bg-[var(--hospital-error)] hover:text-[var(--hospital-white)]"
              onClick={() => handleDelete(patientId)}
              title="Delete Patient"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="card p-4 max-w-[100vw] overflow-x-auto min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="card-title">Patients</h1>
        <button
          className="btn btn-primary"
          onClick={() => router.push('/patients/new')}
        >
          <Add className="w-5 h-5" />
          New Patient
        </button>
      </div>
      
      <div className="mb-4 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--hospital-gray-400)]" />
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
      </div>
      
      {error && (
        <div className="alert alert-error mb-4">
          <div className="flex-1">
            <span>Error: {error}</span>
          </div>
          <button 
            className="btn btn-outline"
            onClick={() => fetchPatients()}
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="table w-full">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="loading-spinner" />
          </div>
        ) : (
          <DataGrid
            rows={patients}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 25, 50]}
            autoHeight
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            classes={{
              root: 'table',
              columnHeaders: 'bg-[var(--hospital-gray-50)]',
              row: 'hover:bg-[var(--hospital-gray-50)]',
              cell: 'py-2'
            }}
            localeText={{
              noRowsLabel: 'No patients found',
              errorOverlayDefaultLabel: 'An error occurred while loading patients',
            }}
          />
        )}
      </div>
    </div>
  );
}