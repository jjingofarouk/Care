'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Search, Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPatients() {
      setLoading(true);
      setError(null);
      try {
        const data = await prisma.patient.findMany({
          where: {
            OR: [
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
            ],
          },
          include: {
            addresses: true,
            nextOfKin: true,
            insuranceInfo: true,
          },
          cacheStrategy: { ttl: 60, swr: 60 },
        });

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
              postalCode: primaryAddress.postalCode || '',
            } : null,
            nextOfKin: patient.nextOfKin ? {
              name: `${patient.nextOfKin.firstName || ''} ${patient.nextOfKin.lastName || ''}`.trim(),
              relationship: patient.nextOfKin.relationship || '',
              phone: patient.nextOfKin.phone || '',
              email: patient.nextOfKin.email || '',
            } : null,
            insurance: patient.insuranceInfo ? {
              provider: patient.insuranceInfo.provider || '',
              policyNumber: patient.insuranceInfo.policyNumber || '',
              expiryDate: patient.insuranceInfo.expiryDate || null,
            } : null,
          };
        }).filter(Boolean);

        setPatients(validatedPatients);
      } catch (error) {
        console.error('Failed to fetch patients:', error);
        setError('Failed to load patients. Please try again.');
        setPatients([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, [search]);

  const handleDelete = async (id) => {
    if (!id) {
      console.warn('No patient ID provided for deletion');
      return;
    }

    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await prisma.patient.delete({
          where: { id },
        });
        setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== id));
      } catch (error) {
        console.error('Failed to delete patient:', error);
        setError('Failed to delete patient. Please try again.');
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
      address.country,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(', ') : '-';
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      flex: 1,
      minWidth: 120,
      sortable: true,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">{params.value || 'N/A'}</span>
      ),
    },
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      minWidth: 130,
      sortable: true,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">{params.value || 'N/A'}</span>
      ),
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
      minWidth: 130,
      sortable: true,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">{params.value || 'N/A'}</span>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 180,
      sortable: true,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">{params.value || 'N/A'}</span>
      ),
    },
    {
      field: 'age',
      headerName: 'Age',
      flex: 1,
      minWidth: 80,
      sortable: true,
      valueGetter: (params) => calculateAge(params?.row?.dateOfBirth),
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">{params.value || '-'}</span>
      ),
    },
    {
      field: 'gender',
      headerName: 'Gender',
      flex: 1,
      minWidth: 100,
      sortable: true,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">{params.value || 'N/A'}</span>
      ),
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      minWidth: 130,
      sortable: true,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)]">{params.value || 'N/A'}</span>
      ),
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <span className="text-[var(--hospital-gray-900)] text-sm">{formatAddress(params?.row?.address)}</span>
      ),
    },
    {
      field: 'nextOfKin',
      headerName: 'Next of Kin',
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        const nextOfKin = params?.row?.nextOfKin;
        return nextOfKin?.name ? (
          <div className="flex flex-col">
            <span className="font-medium text-[var(--hospital-gray-900)] text-sm">{nextOfKin.name}</span>
            <span className="text-[var(--hospital-gray-600)] text-xs">{nextOfKin.relationship || '-'}</span>
          </div>
        ) : (
          <span className="text-[var(--hospital-gray-500)] text-sm">-</span>
        );
      },
    },
    {
      field: 'insurance',
      headerName: 'Insurance',
      flex: 1,
      minWidth: 150,
      sortable: false,
      renderCell: (params) => {
        const insurance = params?.row?.insurance;
        if (!insurance?.provider) {
          return <span className="text-[var(--hospital-gray-500)] text-sm">-</span>;
        }
        const isExpired = insurance.expiryDate && new Date(insurance.expiryDate) < new Date();
        return (
          <div className="flex flex-col">
            <span className="font-medium text-[var(--hospital-gray-900)] text-sm">{insurance.provider}</span>
            <span className="text-[var(--hospital-gray-600)] text-xs">{insurance.policyNumber || '-'}</span>
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
      flex: 1,
      minWidth: 120,
      sortable: true,
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
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const patientId = params?.row?.id;
        if (!patientId) return null;
        return (
          <div className="flex gap-1">
            <button
              className="btn btn-outline p-1"
              onClick={() => router.push(`/patients/${patientId}`)}
              title="View Patient"
            >
              <Visibility className="h-4 w-4" />
            </button>
            <button
              className="btn btn-outline p-1"
              onClick={() => router.push(`/patients/edit/${patientId}`)}
              New Patient
              title="Edit Patient"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              className="btn btn-danger p-1"
              onClick={() => handleDelete(patientId)}
              title="Delete Patient"
            >
              <Delete className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[var(--hospital-gray-50)]">
      <div className="mx-auto w-full max-recipe[1920px] px-2 sm:px-4">
        <div className="card">
          <div className="card-header">
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <h1 className="card-title text-[var(--role-doctor)]">Patients</h1>
              <button
                className="btn btn-primary bg-[var(--role-doctor)] w-full sm:w-auto"
                onClick={() => router.push('/patients/new')}
              >
                <Add className="h-4 w-4" />
                New Patient
              </button>
            </div>
          </div>

          <div className="p-2">
            <div className="mb-2 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--hospital-gray-400)] h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-10 w-full text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="alert alert-error m-2">
                <span>Error: {error}</span>
                <button
                  className="btn btn-outline p-1"
                  onClick={() => fetchPatients()}
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center p-2">
                <div className="loading-spinner" />
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
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
                  sx={{
                    '& .MuiDataGrid-root': {
                      border: '1px solid var(--hospital-gray-200)',
                      borderRadius: '0.5rem',
                      boxShadow: 'var(--shadow-sm)',
                      width: '100%',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: 'var(--hospital-gray-50)',
                      color: 'var(--hospital-gray-500)',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid var(--hospital-gray-200)',
                      padding: '0.25rem 0.75rem',
                    },
                    '& .MuiDataGrid-cell': {
                      borderTop: '1px solid var(--hospital-gray-200)',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.875rem',
                    },
                    '& .MuiDataGrid-row:hover': {
                      backgroundColor: 'var(--hospital-gray-50)',
                    },
                    '& .MuiDataGrid-footerContainer': {
                      backgroundColor: 'var(--hospital-gray-50)',
                      borderTop: '1px solid var(--hospital-gray-200)',
                      padding: '0.25rem',
                    },
                  }}
                  slots={{
                    noRowsOverlay: () => (
                      <div className="flex items-center justify-center h-full py-2">
                        <span className="text-[var(--hospital-gray-500)]">No patients found</span>
                      </div>
                    ),
                    loadingOverlay: () => (
                      <div className="flex items-center justify-center h-full py-2">
                        <div className="loading-spinner" />
                      </div>
                    ),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientList;