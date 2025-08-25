'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../auth/AuthContext';
import { getSurgery } from '@/services/operationTheatreService';
import SurgeryForm from '../components/SurgeryForm';

const SurgeryDetails = () => {
  const { id } = useParams();
  const [surgery, setSurgery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !['DOCTOR', 'SURGEON', 'ADMIN'].includes(user.role)) {
      router.push('/');
      return;
    }
    fetchSurgery();
  }, [user, router, id]);

  const fetchSurgery = async () => {
    setLoading(true);
    setError(null);
    try {
      const surgeryData = await getSurgery(id);
      setSurgery(surgeryData);
    } catch (err) {
      setError('Failed to fetch surgery details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/surgeries/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        router.push('/operation-theatre');
      } else {
        setError('Failed to delete surgery');
      }
    } catch (error) {
      setError('Error deleting surgery');
      console.error(error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PLANNED': return 'badge-info';
      case 'IN_PROGRESS': return 'badge-warning';
      case 'COMPLETED': return 'badge-success';
      case 'CANCELLED': return 'badge-error';
      default: return 'badge-neutral';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-6">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!surgery) {
    return (
      <div className="container mx-auto p-6">
        <div className="alert alert-error">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Surgery not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-hospital-gray-900 mb-6">Surgery Details</h1>
      {editMode ? (
        <SurgeryForm
          initialData={surgery}
          onClose={() => setEditMode(false)}
          onSuccess={() => {
            setEditMode(false);
            fetchSurgery();
          }}
        />
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Surgery #{surgery.id.slice(0, 8)}</h2>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-hospital-gray-700">Patient ID:</span>
              <span className="ml-2 text-hospital-gray-900">{surgery.patientId.slice(0, 8)}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-hospital-gray-700">Theatre:</span>
              <span className="ml-2 text-hospital-gray-900">{surgery.theatre.name}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-hospital-gray-700">Surgical Team:</span>
              <span className="ml-2 text-hospital-gray-900">{surgery.surgicalTeam.name}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-hospital-gray-700">Type:</span>
              <span className="ml-2 text-hospital-gray-900">{surgery.type || 'N/A'}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-hospital-gray-700">Status:</span>
              <span className={`ml-2 badge ${getStatusBadgeClass(surgery.status)}`}>
                {surgery.status}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-hospital-gray-700">Estimated Duration:</span>
              <span className="ml-2 text-hospital-gray-900">{surgery.estimatedDurationMinutes || 'N/A'} minutes</span>
            </div>
            <div>
              <span className="text-sm font-medium text-hospital-gray-700">Actual Duration:</span>
              <span className="ml-2 text-hospital-gray-900">{surgery.actualDurationMinutes || 'N/A'} minutes</span>
            </div>
            <div>
              <span className="text-sm font-medium text-hospital-gray-700">Notes:</span>
              <span className="ml-2 text-hospital-gray-900">{surgery.notes || 'N/A'}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-hospital-gray-700">Complications:</span>
              <span className="ml-2 text-hospital-gray-900">{surgery.complications || 'N/A'}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-hospital-gray-700">Pre-Op Assessment ID:</span>
              <span className="ml-2 text-hospital-gray-900">{surgery.preOpAssessmentId || 'N/A'}</span>
            </div>
            <div className="pt-4">
              <h3 className="text-lg font-semibold text-hospital-gray-900 mb-2">Audit Logs</h3>
              {surgery.auditLogs.length > 0 ? (
                <div className="space-y-2">
                  {surgery.auditLogs.map((log) => (
                    <div key={log.id} className="text-sm text-hospital-gray-700">
                      {log.fieldChanged} changed by {log.changedById.slice(0, 8)} at {new Date(log.changedAt).toLocaleString()}: {log.oldValue || 'N/A'} → {log.newValue || 'N/A'}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-hospital-gray-500">No audit logs available</div>
              )}
            </div>
            <div className="flex gap-2 pt-4">
              <button className="btn btn-primary" onClick={() => setEditMode(true)}>
                Edit
              </button>
              {user.role === 'ADMIN' && (
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurgeryDetails;