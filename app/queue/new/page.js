'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import queueService from '@/services/queueService';

export default function NewQueueEntryPage() {
  const [formData, setFormData] = useState({
    patientId: '',
    serviceCounterId: '',
    queueStatusId: '',
    queueNumber: '',
  });
  const [patients, setPatients] = useState([]);
  const [serviceCounters, setServiceCounters] = useState([]);
  const [queueStatuses, setQueueStatuses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      queueService.getPatients(),
      queueService.getServiceCounters(),
      queueService.getQueueStatuses(),
    ]).then(([patients, counters, statuses]) => {
      setPatients(patients);
      setServiceCounters(counters);
      setQueueStatuses(statuses);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await queueService.create(formData);
    router.push('/queue');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-hospital-gray-50 p-4">
      <h1 className="text-2xl font-bold text-hospital-gray-900 mb-4">Add New Queue Entry</h1>
      <form onSubmit={handleSubmit} className="bg-hospital-white p-6 rounded-md shadow-md">
        <div className="mb-4">
          <label className="block text-hospital-gray-700">Patient</label>
          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className="w-full border border-hospital-gray-300 p-2 rounded-md"
            required
          >
            <option value="">Select Patient</option>
            {patients.map(patient => (
              <option key={patient.id} value={patient.id}>{patient.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-hospital-gray-700">Service Counter</label>
          <select
            name="serviceCounterId"
            value={formData.serviceCounterId}
            onChange={handleChange}
            className="w-full border border-hospital-gray-300 p-2 rounded-md"
            required
          >
            <option value="">Select Service Counter</option>
            {serviceCounters.map(counter => (
              <option key={counter.id} value={counter.id}>{counter.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-hospital-gray-700">Queue Status</label>
          <select
            name="queueStatusId"
            value={formData.queueStatusId}
            onChange={handleChange}
            className="w-full border border-hospital-gray-300 p-2 rounded-md"
            required
          >
            <option value="">Select Status</option>
            {queueStatuses.map(status => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-hospital-gray-700">Queue Number</label>
          <input
            type="number"
            name="queueNumber"
            value={formData.queueNumber}
            onChange={handleChange}
            className="w-full border border-hospital-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push('/queue')}
            className="bg-hospital-gray-400 text-hospital-white px-4 py-2 rounded-md mr-2 hover:bg-hospital-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-hospital-accent text-hospital-white px-4 py-2 rounded-md hover:bg-hospital-accent-dark"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
