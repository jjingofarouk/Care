'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createLabRequest, getLabTests, getSamples } from '@/services/laboratoryService';
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

  // Handle lab test name input and suggestions
  const handleLabTestInput = (value) => {
    setFormData({ ...formData, labTestName: value, labTestId: '' });
    if (value) {
      const filtered = labTests.filter((test) =>
        test.name.toLowerCase().includes(value.toLowerCase())
      );
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
    if (value) {
      const filtered = samples.filter((sample) =>
        sample.sampleType.toLowerCase().includes(value.toLowerCase())
      );
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
  };

  // Handle selecting a sample suggestion
  const selectSample = (sample) => {
    setFormData({ ...formData, sampleType: sample.sampleType, sampleId: sample.id });
    setShowSampleDropdown(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.labTestId) {
      alert('Please select a valid lab test from the suggestions.');
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
      alert('Failed to create lab request.');
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
              onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              className="input w-full"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Lab Test</label>
            <input
              type="text"
              value={formData.labTestName}
              onChange={(e) => handleLabTestInput(e.target.value)}
              className="input w-full"
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
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-1">Sample Type</label>
            <input
              type="text"
              value={formData.sampleType}
              onChange={(e) => handleSampleInput(e.target.value)}
              className="input w-full"
              placeholder="e.g., Blood"
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