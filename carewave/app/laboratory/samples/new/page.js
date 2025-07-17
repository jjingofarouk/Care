'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSample, validatePatientId, getPatientInfo } from '@/services/laboratoryService';
import { Save, X, User, Calendar, TestTube } from 'lucide-react';

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

  // Handle patient ID input and validation
  const handlePatientIdInput = async (value) => {
    setFormData({ ...formData, patientId: value });
    setPatientInfo(null);
    setErrors({ ...errors, patientId: '' });

    // Validate patient ID if it's not empty
    if (value.trim()) {
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
    <div className="animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <TestTube className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-[var(--hospital-gray-900)]">New Sample</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          {/* Patient Information Section */}
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Patient ID *
            </label>
            <input
              type="text"
              value={formData.patientId}
              onChange={(e) => handlePatientIdInput(e.target.value)}
              className={`input w-full ${
                errors.patientId ? 'border-red-500' : ''
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

          {/* Sample Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-2">
              <TestTube className="w-4 h-4 inline mr-1" />
              Sample Type *
            </label>
            <input
              type="text"
              value={formData.sampleType}
              onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
              className={`input w-full ${
                errors.sampleType ? 'border-red-500' : ''
              }`}
              placeholder="e.g., Blood, Urine, Stool"
              disabled={isSubmitting}
            />
            {errors.sampleType && <p className="text-red-500 text-sm mt-1">{errors.sampleType}</p>}
          </div>

          {/* Collection Date */}
          <div>
            <label className="block text-sm font-medium text-[var(--hospital-gray-700)] mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Collected At *
            </label>
            <input
              type="datetime-local"
              value={formData.collectedAt}
              onChange={(e) => setFormData({ ...formData, collectedAt: e.target.value })}
              className={`input w-full ${
                errors.collectedAt ? 'border-red-500' : ''
              }`}
              disabled={isSubmitting}
            />
            {errors.collectedAt && <p className="text-red-500 text-sm mt-1">{errors.collectedAt}</p>}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn btn-primary flex-1 gap-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Creating...' : 'Create Sample'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/laboratory/samples')}
              disabled={isSubmitting}
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