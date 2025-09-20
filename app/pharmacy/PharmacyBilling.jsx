// pharmacy/PharmacyBilling.jsx
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, Button, Alert } from '@mui/material';
import { processRefund, getPrescriptions } from './pharmacyService';

export default function PharmacyBilling() {
  const [invoices, setInvoices] = useState([]);
  const [refundData, setRefundData] = useState({
    invoiceId: '',
    reason: '',
    amount: 0,
    processedById: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Load prescriptions and extract invoice info
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const prescriptions = await getPrescriptions();

      const invoiceRows = prescriptions
        .filter((p) => p.invoice)
        .map((p) => ({
          id: p.invoice.id,
          prescriptionId: p.id,
          totalAmount: p.invoice.totalAmount || 0,
          status: p.invoice.status || 'N/A',
          paymentMethod: p.invoice.paymentMethod || 'N/A',
        }));

      setInvoices(invoiceRows);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.details || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle refund processing
  const handleProcessRefund = async () => {
    try {
      await processRefund(refundData);
      setRefundData({
        invoiceId: '',
        reason: '',
        amount: 0,
        processedById: '',
      });
      await fetchInvoices();
      setError(null);
    } catch (error) {
      setError(error.response?.data?.details || error.message);
    }
  };

  // DataGrid columns definition
  const columns = [
    { field: 'id', headerName: 'Invoice ID', width: 100 },
    { field: 'prescriptionId', headerName: 'Prescription ID', width: 150 },
    { field: 'totalAmount', headerName: 'Total Amount', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'paymentMethod', headerName: 'Payment Method', width: 150 },
  ];

  return (
    <Box className="p-6 bg-hospital-white dark:bg-hospital-gray-900">
      <h2 className="text-lg font-semibold text-hospital-gray-900 dark:text-hospital-white mb-4">
        Billing & Invoicing
      </h2>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <Box className="space-y-4">
          <Box className="h-16 bg-hospital-gray-100 dark:bg-hospital-gray-700 rounded-md animate-pulse"></Box>
          <Box className="h-96 bg-hospital-gray-100 dark:bg-hospital-gray-700 rounded-md animate-pulse"></Box>
        </Box>
      ) : (
        <>
          {/* Refund Form */}
          <Box className="mb-4 flex flex-wrap gap-4">
            <TextField
              label="Invoice ID"
              name="invoiceId"
              value={refundData.invoiceId}
              onChange={(e) => setRefundData({ ...refundData, invoiceId: e.target.value })}
              className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            />
            <TextField
              label="Reason"
              name="reason"
              value={refundData.reason}
              onChange={(e) => setRefundData({ ...refundData, reason: e.target.value })}
              className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            />
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={refundData.amount}
              onChange={(e) =>
                setRefundData({ ...refundData, amount: parseFloat(e.target.value) || 0 })
              }
              className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            />
            <TextField
              label="Processed By ID"
              name="processedById"
              value={refundData.processedById}
              onChange={(e) => setRefundData({ ...refundData, processedById: e.target.value })}
              className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md"
            />
            <Button
              variant="contained"
              onClick={handleProcessRefund}
              className="bg-hospital-accent text-hospital-white hover:bg-hospital-teal-light rounded-md px-4 py-2"
            >
              Process Refund
            </Button>
          </Box>

          {/* Invoice Table */}
          <DataGrid
            rows={invoices}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            className="bg-hospital-white dark:bg-hospital-gray-900 text-hospital-gray-900 dark:text-hospital-white rounded-md shadow-md"
            autoHeight
          />
        </>
      )}
    </Box>
  );
}