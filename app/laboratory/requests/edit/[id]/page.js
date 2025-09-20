'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getLabRequest, 
  updateLabRequest, 
  getLabTests, 
  getSamplesByPatient, 
  validatePatientId,
  getPatientInfo 
} from '@/services/laboratoryService';
import { Save, X, User, Calendar, TestTube } from 'lucide-react';

export default function LabRequestEdit({ params }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: '',
    labTestName: '',
    labTestId: '',
    sampleType: '',
    sampleId: '',
    requestedAt: ''
  });
  
  const [labTests, setLabTests] = useState([]);
  const [patientSamples, setPatientSamples] = useState([]);
  const [labTestSuggestions, setLabTestSuggestions] = useState([]);
  const [sampleSuggestions, setSampleSuggestions] = useState([]);
  const [showLabTestDropdown, setShowLabTestDropdown] = useState(false);
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [request, tests] = await Promise.all([
          getLabRequest(params.id),
          getLabTests()
        ]);
        
        setLabTests(tests);
        
        // Set form data
        setFormData({
          patientId: request.patientId || '',
          labTestName: request.labTest?.name || '',
          labTestId: request.labTestId || '',
          sampleType: request.sample?.sampleType || '',
          sampleId: request.sampleId || '',
          requestedAt: request.requestedAt ? new Date(request.requestedAt).toISOString().slice(0, 16) : ''
        });

        // Fetch patient info and samples
        if (request.patientId) {
          const [patient, samples] = await Promise.all([
            getPatientInfo(request.patientId),
            getSamplesByPatient(request.patientId)
          ]);
          setPatientInfo(patient);
          setPatientSamples(samples);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  // Handle patient ID input and validation
  const handlePatientIdInput = async (value) => {
    setFormData({ ...formData, patientId: value, sampleType: '', sampleId: '' });
    setPatientSamples([]);
    setSampleSuggestions([]);
    setShowSampleDropdown(false);
    setPatientInfo(null);
    setErrors({ ...errors, patientId: '' });

    if (value.trim()) {
      try {
        const isValid = await validatePatientId(value.trim());
        if (isValid) {
          const [patient, samples] = await Promise.all([
            getPatientInfo(value.trim()),
            getSamplesByPatient(value.trim())
          ]);
          setPatientInfo(patient);
          setPatientSamples(samples);
        } else {
          setErrors({ ...errors, patientId: 'Patient not found' });
        }
      } catch (error) {
        console.error('Error validating patient:', error);
        setErrors({ ...errors, patientId: 'Error validating patient' });
      }
    }
  };

  // Handle lab test name input and suggestions
  const handleLabTestInput = (value) => {
    setFormData({ ...formData, labTestName: value, labTestId: '' });
    setErrors({ ...errors, labTestName: '' });
    
    if (value.trim()) {
      const filtered = labTests
        .filter((test) => test.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10);
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
    
    if (value.trim() && patientSamples.length > 0) {
      const filtered = patientSamples
        .filter((sample) =>
          sample.sampleType.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 10);
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

  // Clear sample selection
  const clearSample = () => {
    setFormData({ ...formData, sampleType: '', sampleId: '' });
  };

  // Handle form submission with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors = {};

    // Validate patientId
    if (!formData.patientId.trim()) {
      newErrors.patientId = 'Patient ID is required';
    } else if (!patientInfo) {
      newErrors.patientId = 'Please select a valid patient';
    }

    // Validate labTestId
    if (!formData.labTestId) {
      newErrors.labTestName = 'Please select a valid lab test';
    }

    // Validate requestedAt
    if (!formData.requestedAt) {
      newErrors.requestedAt = 'Request date is required';
    } else {
      const requestDate = new Date(formData.requestedAt);
      const now = new Date();
      if (requestDate > now) {
        newErrors.requestedAt = 'Request date cannot be in the future';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const requestData = {
        patientId: formData.patientId.trim(),
        labTestId: formData.labTestId,
        sampleId: formData.sampleId || null,
        requestedAt: formData.requestedAt,
      };
      
      await updateLabRequest(params.id, requestData);
      router.push('/laboratory/requests');
    } catch (error) {
      console.error('Error updating lab request:', error);
      setErrors({ ...errors, general: 'Failed to update lab request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="flex space-x-2">
              <div className="h-10 bg-gray-200 rounded w-20"></div>
              <div className="h-10 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <TestTube className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Edit Lab Request</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Patient Information Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Patient ID
            </label>
            <input
              type="text"
              value={formData.patientId}
              onChange={(e) => handlePatientIdInput(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.patientId ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter Patient ID"
              disabled={isSubmitting}
            />
            {errors.patientId && <p className="text-red-500 text-sm mt-1">{errors.patientId}</p>}
            
            {/* Patient Info Display */}
            {patientInfo && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  <strong>Patient:</strong> {patientInfo.firstName} {patientInfo.lastName}
                  {patientInfo.dateOfBirth && (
                    <span className="ml-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      DOB: {new Date(patientInfo.dateOfBirth).toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Lab Test Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lab Test *
            </label>
            <input
              type="text"
              value={formData.labTestName}
              onChange={(e) => handleLabTestInput(e.target.value)}
              onFocus={() => formData.labTestName && setShowLabTestDropdown(true)}
              onBlur={() => setTimeout(() => setShowLabTestDropdown(false), 200)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.labTestName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Search for lab test (e.g., Complete Blood Count)"
              disabled={isSubmitting}
            />
            
            {showLabTestDropdown && labTestSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
                {labTestSuggestions.map((test) => (
                  <li
                    key={test.id}
                    onClick={() => selectLabTest(test)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{test.name}</div>
                    {test.description && (
                      <div className="text-sm text-gray-600 mt-1">{test.description}</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {errors.labTestName && <p className="text-red-500 text-sm mt-1">{errors.labTestName}</p>}
          </div>

          {/* Sample Selection */}
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Sample (Optional)
              </label>
              {formData.sampleId && (
                <button
                  type="button"
                  onClick={clearSample}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear Sample
                </button>
              )}
            </div>
            <input
              type="text"
              value={formData.sampleType}
              onChange={(e) => handleSampleInput(e.target.value)}
              onFocus={() => formData.sampleType && setShowSampleDropdown(true)}
              onBlur={() => setTimeout(() => setShowSampleDropdown(false), 200)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.sampleType ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Search for existing sample (e.g., Blood)"
              disabled={!patientInfo || isSubmitting}
            />
            
            {showSampleDropdown && sampleSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto shadow-lg">
                {sampleSuggestions.map((sample) => (
                  <li
                    key={sample.id}
                    onClick={() => selectSample(sample)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium">{sample.sampleType}</div>
                    <div className="text-sm text-gray-600">
                      Collected: {new Date(sample.collectedAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {errors.sampleType && <p className="text-red-500 text-sm mt-1">{errors.sampleType}</p>}
            
            {patientInfo && patientSamples.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">No existing samples found for this patient</p>
            )}
          </div>

          {/* Request Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Requested At *
            </label>
            <input
              type="datetime-local"
              value={formData.requestedAt}
              onChange={(e) => setFormData({ ...formData, requestedAt: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.requestedAt ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.requestedAt && <p className="text-red-500 text-sm mt-1">{errors.requestedAt}</p>}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Updating...' : 'Update Request'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/laboratory/requests')}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
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