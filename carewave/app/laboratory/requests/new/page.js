'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createLabRequest } from '@/services/laboratoryService';
import { getPatients } from '@/services/patientService';
import axios from 'axios';
import { Save, X } from 'lucide-react';

export default function LabRequestNew() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: '',
    labTestId: '',
    sampleId: '',
    requestedAt: '',
  });
  const [patients, setPatients] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [samples, setSamples] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [filteredLabTests, setFilteredLabTests] = useState([]);
  const [filteredSamples, setFilteredSamples] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsData = await getPatients();
        setPatients(patientsData);
        setFilteredPatients(patientsData);

        const labTestsResponse = await axios.get('/api/lab-tests');
        setLabTests(labTestsResponse.data);
        setFilteredLabTests(labTestsResponse.data);

        const samplesResponse = await axios.get('/api/samples');
        setSamples(samplesResponse.data);
        setFilteredSamples(samplesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    if (field === 'patientId') {
      const searchTerm = value.toLowerCase();
      setFilteredPatients(
        patients.filter(
          (patient) =>
            patient.id.toLowerCase().includes(searchTerm) ||
            `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm)
        )
      );
    } else if (field === 'labTestId') {
      const searchTerm = value.toLowerCase();
      setFilteredLabTests(
        labTests.filter(
          (test) =>
            test.id.toLowerCase().includes(searchTerm) ||
            test.name.toLowerCase().includes(searchTerm)
        )
      );
    } else if (field === 'sampleId') {
      const searchTerm = value.toLowerCase();
      setFilteredSamples(
        samples.filter(
          (sample) =>
            sample.id.toLowerCase().includes(searchTerm) ||
            sample.sampleType.toLowerCase().includes(searchTerm)
        )
      );
    }
  };

  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (field === 'patientId') {
      setFilteredPatients(patients);
    } else if (field === 'labTestId') {
      setFilteredLabTests(labTests);
    } else if (field === 'sampleId') {
      setFilteredSamples(samples);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLabRequest(formData);
      router.push('/laboratory/requests');
    } catch (error) {
      console.error('Error creating lab request:', error);
    }
  };

  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)] mb-6">New Lab Request</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Patient</label>
            <input
              type="text"
              value={formData.patientId}
              onChange={(e) => handleInputChange('patientId', e.target.value)}
              className="input w-full"
              placeholder="Search by ID or Name"
            />
            {formData.patientId && filteredPatients.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                {filteredPatients.map((patient) => (
                  <li
                    key={patient.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect('patientId', patient.id)}
                  >
                    {patient.id} - {patient.firstName} {patient.lastName}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Lab Test</label>
            <input
              type="text"
              value={formData.labTestId}
              onChange={(e) => handleInputChange('labTestId', e.target.value)}
              className="input w-full"
              placeholder="Search by ID or Test Name"
            />
            {formData.labTestId && filteredLabTests.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                {filteredLabTests.map((test) => (
                  <li
                    key={test.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect('labTestId', test.id)}
                  >
                    {test.id} - {test.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Sample</label>
            <input
              type="text"
              value={formData.sampleId}
              onChange={(e) => handleInputChange('sampleId', e.target.value)}
              className="input w-full"
              placeholder="Search by ID or Sample Type"
            />
            {formData.sampleId && filteredSamples.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                {filteredSamples.map((sample) => (
                  <li
                    key={sample.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelect('sampleId', sample.id)}
                  >
                    {sample.id} - {sample.sampleType}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Requested At</label>
            <input
              type="datetime-local"
              value={formData.requestedAt}
              onChange={(e) => setFormData({ ...formData, requestedAt: e.target.value })}
              className="input w-full"
            />
          </div>
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="btn btn-primary flex-1 gap-2"
            >
              <Save className="w-5 h-5" />
              Create
            </button>
            <button
              type="button"
              onClick={() => router.push('/laboratory/requests')}
              className="btn btn-secondary flex-1 gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}