'use client';
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Hospital } from 'lucide-react';
import AdmissionForm from '../../components/adt/AdmissionForm';
import DischargeForm from '../../components/adt/DischargeForm';
import TransferForm from '../../components/adt/TransferForm';
import BedStatus from '../../components/adt/BedStatus';
import adtService from '../../services/adtService';

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [openAdmissionForm, setOpenAdmissionForm] = useState(false);
  const [openDischargeForm, setOpenDischargeForm] = useState(false);
  const [openTransferForm, setOpenTransferForm] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const data = await adtService.getAdmissions();
      setAdmissions(data);
    } catch (error) {
      console.error('Error fetching admissions:', error);
    }
  };

  const columns = [
    { 
      field: 'patientName', 
      headerName: 'Patient', 
      flex: 1,
      minWidth: 150,
      valueGetter: (params) => params.row.patient.name 
    },
    { 
      field: 'wardName', 
      headerName: 'Ward', 
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => params.row.ward.name 
    },
    { 
      field: 'bedNumber', 
      headerName: 'Bed', 
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => params.row.bed?.bedNumber || 'N/A' 
    },
    {
      field: 'admissionDate',
      headerName: 'Admission Date',
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => new Date(params.row.admissionDate).toLocaleDateString(),
    },
    {
      field: 'emergency',
      headerName: 'Emergency',
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => params.row.emergencyCases.length > 0 ? params.row.emergencyCases[0].triage.triageLevel : 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            className="btn btn-outline text-xs"
            onClick={() => {
              setSelectedAdmission(params.row);
              setOpenAdmissionForm(true);
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-outline text-xs"
            onClick={() => {
              setSelectedAdmission(params.row);
              setOpenDischargeForm(true);
            }}
          >
            Discharge
          </button>
          <button
            className="btn btn-outline text-xs"
            onClick={() => {
              setSelectedAdmission(params.row);
              setOpenTransferForm(true);
            }}
          >
            Transfer
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full p-2 sm:p-3">
      <div className="flex items-center gap-2 mb-4">
        <Hospital className="h-6 w-6 text-[var(--hospital-gray-900)]" />
        <h1 className="card-title">Admissions</h1>
      </div>
      <button
        className="btn btn-primary mb-4"
        onClick={() => {
          setSelectedAdmission(null);
          setOpenAdmissionForm(true);
        }}
      >
        New Admission
      </button>
      <div className="card mb-4">
        <div className="card-header">
          <h2 className="card-title">Current Admissions</h2>
        </div>
        <div className="w-full overflow-x-auto custom-scrollbar">
          <DataGrid
            rows={admissions}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            autoHeight
            disableRowSelectionOnClick
            className="table mobile-full-width"
            classes={{
              root: 'bg-[var(--hospital-white)]',
              columnHeaders: 'bg-[var(--hospital-gray-50)]',
              columnHeader: 'text-[var(--hospital-gray-500)] uppercase tracking-wider',
              cell: 'text-[var(--hospital-gray-900)] border-t border-[var(--hospital-gray-200)]',
              row: 'hover:bg-[var(--hospital-gray-50)]',
            }}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Bed Status</h2>
        </div>
        <BedStatus />
      </div>
      <AdmissionForm
        open={openAdmissionForm}
        onClose={() => setOpenAdmissionForm(false)}
        admission={selectedAdmission}
        onSave={fetchAdmissions}
      />
      <DischargeForm
        open={openDischargeForm}
        onClose={() => setOpenDischargeForm(false)}
        admission={selectedAdmission}
        onSave={fetchAdmissions}
      />
      <TransferForm
        open={openTransferForm}
        onClose={() => setOpenTransferForm(false)}
        admission={selectedAdmission}
        onSave={fetchAdmissions}
      />
    </div>
  );
}