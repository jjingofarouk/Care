// pages/laboratory/requests/new.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createLabRequest, 
  getLabTests, 
  getSamplesByPatient, 
  validatePatientId,
  getPatientInfo 
} from '@/services/laboratoryService';
import { 
  Save, 
  X, 
  User, 
  Calendar, 
  TestTube, 
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  Beaker,
  Info
} from 'lucide-react';

export default function LabRequestNew() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    patientId: '',
    labTestName: '',
    labTestId: '',
    sampleType: '',
    sampleId: '',
    requestedAt: new Date().toISOString().slice(0, 16),
  });
  
  const [labTests, setLabTests] = useState([]);
  const [patientSamples, setPatientSamples] = useState([]);
  const [labTestSuggestions, setLabTestSuggestions] = useState([]);
  const [sampleSuggestions, setSampleSuggestions] = useState([]);
  const [showLabTestDropdown, setShowLabTestDropdown] = useState(false);
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);

  const steps = [
    { id: 1, title: 'Patient Info', icon: User },
    { id: 2, title: 'Lab Test', icon: TestTube },
    { id: 3, title: 'Sample & Details', icon: Beaker },
    { id: 4, title: 'Review', icon: CheckCircle }
  ];

  useEffect(() => {
    const fetchLabTests = async () => {
      try {
        const tests = await getLabTests();
        setLabTests(tests);
      } catch (error) {
        console.error('Error fetching lab tests:', error);
        setErrors({ ...errors, general: 'Failed to load lab tests' });
      }
    };
    fetchLabTests();
  }, []);

  const handlePatientIdInput = async (value) => {
    setFormData({ ...formData, patientId: value, sampleType: '', sampleId: '' });
    setPatientSamples([]);
    setSampleSuggestions([]);
    setShowSampleDropdown(false);
    setPatientInfo(null);
    setErrors({ ...errors, patientId: '' });
    setIsLoadingPatient(false);

    if (value.trim()) {
      setIsLoadingPatient(true);
      try {
        const isValid = await validatePatientId(value.trim());
        if (isValid) {
          const patient = await getPatientInfo(value.trim());
          setPatientInfo(patient);
          const samples = await getSamplesByPatient(value.trim());
          setPatientSamples(samples);
        } else {
          setErrors({ ...errors, patientId: 'Patient not found' });
        }
      } catch (error) {
        console.error('Error validating patient:', error);
        setErrors({ ...errors, patientId: 'Error validating patient' });
      } finally {
        setIsLoadingPatient(false);
      }
    }
  };

  const handleLabTestInput = (value) => {
    setFormData({ ...formData, labTestName: value, labTestId: '' });
    setErrors({ ...errors, labTestName: '' });
    
    if (value.trim()) {
      const filtered = labTests
        .filter((test) => test.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 8);
      setLabTestSuggestions(filtered);
      setShowLabTestDropdown(true);
    } else {
      setLabTestSuggestions([]);
      setShowLabTestDropdown(false);
    }
  };

  const handleSampleInput = (value) => {
    setFormData({ ...formData, sampleType: value, sampleId: '' });
    setErrors({ ...errors, sampleType: '' });
    
    if (value.trim() && patientSamples.length > 0) {
      const filtered = patientSamples
        .filter((sample) =>
          sample.sampleType.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 8);
      setSampleSuggestions(filtered);
      setShowSampleDropdown(true);
    } else {
      setSampleSuggestions([]);
      setShowSampleDropdown(false);
    }
  };

  const selectLabTest = (test) => {
    setFormData({ ...formData, labTestName: test.name, labTestId: test.id });
    setShowLabTestDropdown(false);
    setErrors({ ...errors, labTestName: '' });
  };

  const selectSample = (sample) => {
    setFormData({ ...formData, sampleType: sample.sampleType, sampleId: sample.id });
    setShowSampleDropdown(false);
    setErrors({ ...errors, sampleType: '' });
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.patientId.trim()) {
        newErrors.patientId = 'Patient ID is required';
      } else if (!patientInfo) {
        newErrors.patientId = 'Please select a valid patient';
      }
    }
    
    if (currentStep === 2) {
      if (!formData.labTestId) {
        newErrors.labTestName = 'Please select a lab test';
      }
    }
    
    if (currentStep === 3) {
      if (!formData.requestedAt) {
        newErrors.requestedAt = 'Request date is required';
      } else {
        const requestDate = new Date(formData.requestedAt);
        const now = new Date();
        if (requestDate > now) {
          newErrors.requestedAt = 'Request date cannot be in the future';
        }
      }
      // Validate sample if provided
      if (formData.sampleId) {
        const sample = patientSamples.find(s => s.id === formData.sampleId);
        if (!sample) {
          newErrors.sampleType = 'Selected sample is invalid';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) {
      setIsSubmitting(false);
      return;
    }
    
    setIsSubmitting(true);

    try {
      const requestData = {
        patientId: formData.patientId.trim(),
        labTestId: formData.labTestId,
        sampleId: formData.sampleId || null,
        requestedAt: new Date(formData.requestedAt).toISOString(),
      };
      
      await createLabRequest(requestData);
      router.push('/laboratory/requests');
    } catch (error) {
      console.error('Error creating lab request:', error);
      setErrors({ ...errors, general: error.message || 'Failed to create lab request. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        const isAccessible = step.id <= currentStep;

        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
              isCompleted 
                ? 'bg-green-500 border-green-500 text-white' 
                : isActive 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'border-gray-300 text-gray-400'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              isAccessible ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 ml-4 ${
                isCompleted ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <h2 className="text-xl font-semibold text-gray-900">Patient Information</h2>
              <p className="text-gray-600">Enter the patient's ID to get started</p>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.patientId}
                  onChange={(e) => handlePatientIdInput(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.patientId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter Patient ID (e.g., P001)"
                  disabled={isSubmitting}
                />
                {isLoadingPatient && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              {errors.patientId && (
                <div className="flex items-center mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{errors.patientId}</span>
                </div>
              )}
            </div>
            
            {patientInfo && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Patient Found</span>
                </div>
                <div className="text-sm text-green-700">
                  <p className="font-medium">{patientInfo.firstName} {patientInfo.lastName}</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>DOB: {new Date(patientInfo.dateOfBirth).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-1">Gender: {patientInfo.gender}</p>
                  {patientInfo.phone && <p>Phone: {patientInfo.phone}</p>}
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <TestTube className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <h2 className="text-xl font-semibold text-gray-900">Select Lab Test</h2>
              <p className="text-gray-600">Choose the laboratory test to request</p>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lab Test *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.labTestName}
                  onChange={(e) => handleLabTestInput(e.target.value)}
                  onFocus={() => formData.labTestName && setShowLabTestDropdown(true)}
                  onBlur={() => setTimeout(() => setShowLabTestDropdown(false), 200)}
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.labTestName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Search for lab test (e.g., Complete Blood Count)"
                  disabled={isSubmitting}
                />
                <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
              
              {showLabTestDropdown && labTestSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-80 overflow-auto shadow-lg">
                  {labTestSuggestions.map((test) => (
                    <div
                      key={test.id}
                      onClick={() => selectLabTest(test)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{test.name}</div>
                      {test.description && (
                        <div className="text-sm text-gray-600 mt-1">{test.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {errors.labTestName && (
                <div className="flex items-center mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{errors.labTestName}</span>
                </div>
              )}
            </div>
            
            {formData.labTestId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">Test Selected: {formData.labTestName}</span>
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Beaker className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <h2 className="text-xl font-semibold text-gray-900">Sample & Details</h2>
              <p className="text-gray-600">Optional sample selection and request details</p>
            </div>
            
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sample (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.sampleType}
                  onChange={(e) => handleSampleInput(e.target.value)}
                  onFocus={() => formData.sampleType && setShowSampleDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSampleDropdown(false), 200)}
                  className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.sampleType ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Search for existing sample (e.g., Blood)"
                  disabled={!patientInfo || isSubmitting}
                />
                <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
              </div>
              
              {showSampleDropdown && sampleSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
                  {sampleSuggestions.map((sample) => (
                    <div
                      key={sample.id}
                      onClick={() => selectSample(sample)}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{sample.sampleType}</div>
                      <div className="text-sm text-gray-600 flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        Collected: {new Date(sample.collectedAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {errors.sampleType && (
                <div className="flex items-center mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{errors.sampleType}</span>
                </div>
              )}
              
              {patientInfo && patientSamples.length === 0 && (
                <div className="flex items-center mt-2 text-gray-500">
                  <Info className="w-4 h-4 mr-1" />
                  <span className="text-sm">No existing samples found for this patient</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.requestedAt}
                onChange={(e) => setFormData({ ...formData, requestedAt: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.requestedAt ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.requestedAt && (
                <div className="flex items-center mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{errors.requestedAt}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <h2 className="text-xl font-semibold text-gray-900">Review Request</h2>
              <p className="text-gray-600">Please review all details before submitting</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Patient Information</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>ID:</strong> {formData.patientId}</p>
                    <p><strong>Name:</strong> {patientInfo?.firstName} {patientInfo?.lastName}</p>
                    <p><strong>DOB:</strong> {patientInfo?.dateOfBirth ? new Date(patientInfo.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Gender:</strong> {patientInfo?.gender || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Lab Test</h3>
                  <div className="text-sm text-gray-600">
                    <p><strong>Test:</strong> {formData.labTestName}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-2">Additional Details</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Sample:</strong> {formData.sampleType || 'None selected'}</p>
                  <p><strong>Request Date:</strong> {new Date(formData.requestedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center text-red-800">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm">{errors.general}</span>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderNavigationButtons = () => {
    return (
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push('/laboratory/requests')}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
          )}
          
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting || (currentStep === 1 && !patientInfo) || (currentStep === 2 && !formData.labTestId)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Request
                </>
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <TestTube className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">New Lab Request</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {renderStepIndicator()}
        
        <form onSubmit={handleSubmit}>
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>
          
          {renderNavigationButtons()}
        </form>
      </div>
    </div>
  );
}