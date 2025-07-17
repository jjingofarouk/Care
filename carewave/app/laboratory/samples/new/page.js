'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSample, validatePatientId, getPatientInfo } from '@/services/laboratoryService';
import { 
  Save, 
  X, 
  User, 
  Calendar, 
  TestTube, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';

export default function SampleNew() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    patientId: '',
    sampleType: '',
    collectedAt: new Date().toISOString().slice(0, 16), // Default to current date/time
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [isLoadingPatient, setIsLoadingPatient] = useState(false);

  // Handle patient ID input and validation
  const handlePatientIdInput = async (value) => {
    setFormData({ ...formData, patientId: value });
    setPatientInfo(null);
    setErrors({ ...errors, patientId: '' });
    setIsLoadingPatient(false);

    // Validate patient ID if it's not empty
    if (value.trim()) {
      setIsLoadingPatient(true);
      try {
        const isValid = await validatePatientId(value.trim());
        if (isValid) {
          // Fetch patient info for display
          const patient = await getPatientInfo(value.trim());
          setPatientInfo(patient);
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

    // Validate sampleType
    if (!formData.sampleType.trim()) {
      newErrors.sampleType = 'Sample type is required';
    }

    // Validate collectedAt
    if (!formData.collectedAt) {
      newErrors.collectedAt = 'Collection date is required';
    } else {
      const collectionDate = new Date(formData.collectedAt);
      const now = new Date();
      if (collectionDate > now) {
        newErrors.collectedAt = 'Collection date cannot be in the future';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const sampleData = {
        patientId: formData.patientId.trim(),
        sampleType: formData.sampleType.trim(),
        collectedAt: formData.collectedAt,
      };
      
      await createSample(sampleData);
      router.push('/laboratory/samples');
    } catch (error) {
      console.error('Error creating sample:', error);
      setErrors({ ...errors, general: 'Failed to create sample. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <TestTube className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">New Sample</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-1" />
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
                placeholder="Enter Patient ID"
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
            
            {/* Patient Info Display */}
            {patientInfo && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4">
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

          {/* Sample Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <TestTube className="w-4 h-4 inline mr-1" />
              Sample Type *
            </label>
            <input
              type="text"
              value={formData.sampleType}
              onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.sampleType ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Blood, Urine, Stool"
              disabled={isSubmitting}
            />
            {errors.sampleType && (
              <div className="flex items-center mt-2 text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.sampleType}</span>
              </div>
            )}
          </div>

          {/* Collection Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Collected At *
            </label>
            <input
              type="datetime-local"
              value={formData.collectedAt}
              onChange={(e) => setFormData({ ...formData, collectedAt: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.collectedAt ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.collectedAt && (
              <div className="flex items-center mt-2 text-red-600">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{errors.collectedAt}</span>
              </div>
            )}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center text-red-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">{errors.general}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting || !patientInfo}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isSubmitting || !patientInfo
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Sample
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.push('/laboratory/samples')}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}