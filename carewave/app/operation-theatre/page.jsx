'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthContext';
import { getSurgeries, getTheatres, getSurgicalTeams } from '@/services/operationTheatreService';
import SurgeryForm from './components/SurgeryForm';
import TheatreForm from './components/TheatreForm';
import SurgicalTeamForm from './components/SurgicalTeamForm';

const OperationTheatre = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [surgeries, setSurgeries] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [surgicalTeams, setSurgicalTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSurgeryForm, setShowSurgeryForm] = useState(false);
  const [showTheatreForm, setShowTheatreForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !['DOCTOR', 'SURGEON', 'ADMIN'].includes(user.role)) {
      router.push('/');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [surgeriesData, theatresData, teamsData] = await Promise.all([
        getSurgeries(),
        getTheatres(),
        getSurgicalTeams(),
      ]);
      setSurgeries(surgeriesData);
      setTheatres(theatresData);
      setSurgicalTeams(teamsData);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-hospital-gray-900 mb-6">Operation Theatre Management</h1>

      {error && (
        <div className="alert alert-error mb-6">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <button
          className="btn btn-primary"
          onClick={() => setShowSurgeryForm(true)}
          disabled={showSurgeryForm}
        >
          Schedule Surgery
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setShowTheatreForm(true)}
          disabled={showTheatreForm}
        >
          Add Theatre
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setShowTeamForm(true)}
          disabled={showTeamForm}
        >
          Create Surgical Team
        </button>
      </div>

      {showSurgeryForm && (
        <SurgeryForm
          onClose={() => setShowSurgeryForm(false)}
          onSuccess={fetchData}
        />
      )}
      {showTheatreForm && (
        <TheatreForm
          onClose={() => setShowTheatreForm(false)}
          onSuccess={fetchData}
        />
      )}
      {showTeamForm && (
        <SurgicalTeamForm
          onClose={() => setShowTeamForm(false)}
          onSuccess={fetchData}
        />
      )}

      <div className="border-b border-hospital-gray-200 mb-6">
        <div className="flex gap-2">
          {['Surgeries', 'Theatres', 'Surgical Teams'].map((tab, index) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium ${activeTab === index ? 'border-b-2 border-hospital-accent text-hospital-accent' : 'text-hospital-gray-500'}`}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-6">
          <div className="loading-spinner" />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          {activeTab === 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient ID</th>
                  <th>Theatre</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Est. Duration</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {surgeries.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id.slice(0, 8)}</td>
                    <td>{row.patientId.slice(0, 8)}</td>
                    <td>{row.theatre?.name}</td>
                    <td>{row.type || 'N/A'}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>{row.estimatedDurationMinutes || 'N/A'} min</td>
                    <td>{new Date(row.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => router.push(`/operation-theatre/${row.id}`)}
                      >
                        View/Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 1 && (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Theatre Name</th>
                  <th>Department ID</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {theatres.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id.slice(0, 8)}</td>
                    <td>{row.name}</td>
                    <td>{row.departmentId.slice(0, 8)}</td>
                    <td>{new Date(row.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === 2 && (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Team Name</th>
                  <th>Members</th>
                </tr>
              </thead>
              <tbody>
                {surgicalTeams.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id.slice(0, 8)}</td>
                    <td>{row.name}</td>
                    <td>
                      {row.members.map((m) => `${m.userId.slice(0, 8)} (${m.role})`).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default OperationTheatre;