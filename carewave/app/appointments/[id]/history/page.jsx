'use client';
import React 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export default function StatusHistoryPage() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/appointments?resource=statusHistory&appointmentId=${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!response.ok) throw new Error('Failed to fetch status history');
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [id]);

  return (
    <div className="p-2 sm:p-4">
      <Typography variant="h4" className="text-[var(--hospital-gray-900)] mb-2">
        Appointment Status History
      </Typography>
      {error && (
        <div className="alert alert-error mb-2">
          <span>{error}</span>
        </div>
      )}
      <div className="card">
        <Table className="table">
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Changed At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2}><div className="loading-spinner mx-auto"></div></TableCell>
              </TableRow>
            ) : history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2}>No status history available</TableCell>
              </TableRow>
            ) : (
              history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.status}</TableCell>
                  <TableCell>{new Date(record.changedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}