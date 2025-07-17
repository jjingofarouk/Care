'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createLabRequest, getLabTests, getSamples, validatePatientId } from '@/services/laboratoryService';
import { Save, X } from 'lucide-react';

export default function LabRequestNew() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: '',
    labTestName: '',
    labTestId: '',
    sampleType: '',
    sampleId: '',
    requestedAt: '',
  });
  const [labTests, setLabTests] = useState([]);
  const [samples, setSamples] = useState([]);
  const [labTestSuggestions, setLabTestSuggestions] = useState([]);
  const [sampleSuggestions, setSampleSuggestions] = useState([]);
  const [showLabTestDropdown, setShowLabTestDropdown] = useState(false);
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch lab tests and samples on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tests = await getLabTests();
        const samples = await getSamples();
        setLabTests(tests);
        setSamples(samples);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle patient ID input
  const handlePatientIdInput = (value) => {
    setFormData({ ...formData, patientId: value, sampleType: '', sampleId: '' });
    setSampleSuggestions([]);
    setShowSampleDropdown(false);
    setErrors({ ...errors, patientId: '' });
  };

  // Handle lab test name input and suggestions
  const handleLabTestInput = (value) => {
    setFormData({ ...formData, labTestName: value, labTestId: '' });
    setErrors({ ...errors, labTestName: '' });
    if (value) {
      const filtered = labTests
        .filter((test) => test.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10); // Limit to 10 suggestions
      setLabTestSuggestions(filtered);
      setShowLabTestDropdown(true);
    } else {
      setLabTestSuggestions([]);
      setShowLabTestDropdown(false);
    }
  };

  // Handle sample type input and suggestions
  const handleSampleInput = (value) => {
    setFormData({ ...formData, sampleType: value, sampleId: '' });
    setErrors({ ...errors, sampleType: '' });
    if (value && formData.patientId) {
      const filtered = samples
        .filter(
          (sample) =>
            sample.sampleType.toLowerCase().includes(value.toLowerCase()) &&
            sample.patientId === formData.patientId
        )
        .slice(0, 10); // Limit to 10 suggestions
      setSampleSuggestions(filtered);
      setShowSampleDropdown(true);
    } else {
      setSampleSuggestions([]);
      setShowSampleDropdown(false);
    }
  };

  // Handle selecting a lab test suggestion
  const selectLabTest = (test) => {
    setFormData({ ...formData, labTestName: test.name, labTestId: test.id });
    setShowLabTestDropdown(false);
    setErrors({ ...errors, labTestName: '' });
  };

  // Handle selecting a sample suggestion
  const selectSample = (sample) => {
    setFormData({ ...formData, sampleType: sample.sampleType, sampleId: sample.id });
    setShowSampleDropdown(false);
    setErrors({ ...errors, sampleType: '' });
  };

  // Handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate patientId
    if (!formData.patientId) {
      newErrors.patientId = 'Patient ID is required';
    } else {
      const isValidPatient = await validatePatientId(formData.patientId);
      if (!isValidPatient) {
        newErrors.patientId = 'Invalid Patient ID';
      }
    }

    // Validate labTestId
    if (!formData.labTestId) {
      newErrors.labTestName = 'Please select a valid lab test';
    }

    // Validate requestedAt
    if (!formData.requestedAt) {
      newErrors.requestedAt = 'Request date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const requestData = {
        patientId: formData.patientId,
        labTestId: formData.labTestId,
        sampleId: formData.sampleId || null, // Sample is optional
        requestedAt: formData.requestedAt,
      };
      await createLabRequest(requestData);
      router.push('/laboratory/requests');
    } catch (error) {
      console.error('Error creating lab request:', error);
      setErrors({ ...errors, general: 'Failed to create lab request' });
    }
  };

  return (
    <div className="animate-slide-up">
      <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)] mb-6">New Lab Request</h1>
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Patient ID</label>
            <input
              type="text"
              value={formData.patientId}
              onChange={(e) => handlePatientIdInput(e.target.value)}
              className={`input w-full ${errors.patientId ? 'border-red-500' : ''}`}
              placeholder="Enter Patient ID"
            />
            {errors.patientId && <p className="text-red-500 text-sm mt-1">{errors.patientId}</p>}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Lab Test</label>
            <input
              type="text"
              value={formData.labTestName}
              onChange={(e) => handleLabTestInput(e.target.value)}
              className={`input w-full ${errors.labTestName ? 'border-red-500' : ''}`}
              placeholder="e.g., Complete Blood Count"
            />
            {showLabTestDropdown && labTestSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                {labTestSuggestions.map((test) => (
                  <li
                    key={test.id}
                    onClick={() => selectLabTest(test)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {test.name}
                  </li>
                ))}
              </ul>
            )}
            {errors.labTestName && <p className="text-red-500 text-sm mt-1">{errors.labTestName}</p>}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Sample Type (Optional)</label>
            <input
              type="text"
              value={formData.sampleType}
              onChange={(e) => handleSampleInput(e.target.value)}
              className={`input w-full ${errors.sampleType ? 'border-red-500' : ''}`}
              placeholder="e.g., Blood"
              disabled={!formData.patientId}
            />
            {showSampleDropdown && sampleSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                {sampleSuggestions.map((sample) => (
                  <li
                    key={sample.id}
                    onClick={() => selectSample(sample)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {sample.sampleType} (Collected: {new Date(sample.collectedAt).toLocaleString()})
                  </li>
                ))}
              </ul>
            )}
            {errors.sampleType && <p className="text-red-500 text-sm mt-1">{errors.sampleType}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Requested At</label>
            <input
              type="datetime-local"
              value={formData.requestedAt}
              onChange={(e) => setFormData({ ...formData, requestedAt: e.target.value })}
              className={`input w-full ${errors.requestedAt ? 'border-red-500' : ''}`}
            />
            {errors.requestedAt && <p className="text-red-500 text-sm mt-1">{errors.requestedAt}</p>}
          </div>
          {errors.general && <p className="text-red-500 text-sm mt-1">{errors.general}</p>}
          <div className="flex space-x-3 pt-2">
            <button type="submit" className="btn btn-primary flex-1 gap-2">
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