'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { getMedicalRecord } from '@/services/medicalRecordService';

export default function MedicalRecordDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMedicalRecord() {
      try {
        setLoading(true);
        const data = await getMedicalRecord(params.id, true);
        setRecord(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching medical record:', error);
        setError(error.message || 'Failed to load medical record');
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      fetchMedicalRecord();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hospital-gray-50">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-hospital-gray-700">Loading medical record...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hospital-gray-50 px-4">
        <div className="alert alert-error max-w-2xl w-full">
          <span>{error}</span>
          <button
            className="btn btn-outline mt-4"
            onClick={() => router.push('/medical-records')}
          >
            Back to Records
          </button>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hospital-gray-50 px-4">
        <div className="alert alert-warning max-w-2xl w-full">
          <span>Medical record not found</span>
          <button
            className="btn btn-outline mt-4"
            onClick={() => router.push('/medical-records')}
          >
            Back to Records
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hospital-gray-50 px-2 sm:px-4 py-4">
      <div className="card max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-hospital-gray-900">
            Medical Record for {record.patient?.firstName || 'N/A'} {record.patient?.lastName || 'N/A'}
          </h1>
          <div className="flex gap-3">
            <button
              className="btn btn-primary"
              onClick={() => router.push(`/medical-records/${params.id}/edit`)}
            >
              Edit Record
            </button>
            <button
              className="btn btn-outline"
              onClick={() => router.push('/medical-records')}
            >
              Back to Records
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <h2 className="card-title">Record Details</h2>
            <p className="text-hospital-gray-700">Record ID: {record.id || 'N/A'}</p>
            <p className="text-hospital-gray-700">
              Record Date: {record.recordDate ? format(new Date(record.recordDate), 'MM/dd/yyyy') : 'N/A'}
            </p>
          </div>

          <div className="border-t border-hospital-gray-200" />

          {record.chiefComplaint && (
            <div>
              <h2 className="card-title">Chief Complaint</h2>
              <p className="text-hospital-gray-700">Description: {record.chiefComplaint.description || 'N/A'}</p>
              <p className="text-hospital-gray-700">Duration: {record.chiefComplaint.duration || 'N/A'}</p>
              <p className="text-hospital-gray-700">Onset: {record.chiefComplaint.onset || 'N/A'}</p>
            </div>
          )}

          {record.presentIllness && (
            <div>
              <h2 className="card-title">Present Illness</h2>
              <p className="text-hospital-gray-700">Narrative: {record.presentIlliness.narrative || 'N/A'}</p>
              <p className="text-hospital-gray-700">Severity: {record.presentIllness.severity || 'N/A'}</p>
              <p className="text-hospital-gray-700">Progress: {record.presentIllness.progress || 'N/A'}</p>
              <p className="text-hospital-gray-700">Associated Symptoms: {record.presentIllness.associatedSymptoms || 'N/A'}</p>
            </div>
          )}

          {record.pastConditions?.length > 0 && (
            <div>
              <h2 className="card-title">Past Medical Conditions</h2>
              {record.pastConditions.map((condition, index) => (
                <div key={index} className="ml-4 border-l-2 border-hospital-gray-200 pl-4 mb-4">
                  <p className="text-hospital-gray-700">Condition: {condition.condition || 'N/A'}</p>
                  <p className="text-hospital-gray-700">
                    Diagnosis Date: {condition.diagnosisDate ? format(new Date(condition.diagnosisDate), 'MM/dd/yyyy') : 'N/A'}
                  </p>
                  <p className="text-hospital-gray-700">Notes: {condition.notes || 'N/A'}</p>
                </div>
              ))}
            </div>
          )}

          {record.surgicalHistory?.length > 0 && (
            <div>
              <h2 className="card-title">Surgical History</h2>
              {record.surgicalHistory.map((surgery, index) => (
                <div key={index} className="ml-4 border-l-2 border-hospital-gray-200 pl-4 mb-4">
                  <p className="text-hospital-gray-700">Procedure: {surgery.procedure || 'N/A'}</p>
                  <p className="text-hospital-gray-700">
                    Date Performed: {surgery.datePerformed ? format(new Date(surgery.datePerformed), 'MM/dd/yyyy') : 'N/A'}
                  </p>
                  <p className="text-hospital-gray-700">Outcome: {surgery.outcome || 'N/A'}</p>
                  <p className="text-hospital-gray-700">Notes: {surgery.notes || 'N/A'}</p>
                </div>
              ))}
            </div>
          )}

          {record.familyHistory?.length > 0 && (
            <div>
              <h2 className="card-title">Family History</h2>
              {record.familyHistory.map((family, index) => (
                <div key={index} className="ml-4 border-l-2 border-hospital-gray-200 pl-4 mb-4">
                  <p className="text-hospital-gray-700">Relative: {family.relative || 'N/A'}</p>
                  <p className="text-hospital-gray-700">Condition: {family.condition || 'N/A'}</p>
                  <p className="text-hospital-gray-700">Age at Diagnosis: {family.ageAtDiagnosis || 'N/A'}</p>
                  <p className="text-hospital-gray-700">Notes: {family.notes || 'N/A'}</p>
                </div>
              ))}
            </div>
          )}

          {record.medicationHistory?.length > 0 && (
            <div>
              <h2 className="card-title">Medication History</h2>
              {record.medicationHistory.map((medication, index) => (
                <div key={index} className="ml-4 border-l-2 border-hospital-gray-200 pl-4 mb-4">
                  <p className="text-hospital-gray-700">Medication: {medication.medicationName || 'N/A'}</p>
                  <p className="text-hospital-gray-700">Dosage: {medication.dosage || 'N/A'}</p>
                  <p className="text-hospital-gray-700">Frequency: {medication.frequency || 'N/A'}</p>
                  <p className="text-hospital-gray-700">
                    Start Date: {medication.startDate ? format(new Date(medication.startDate), 'MM/dd/yyyy') : 'N/A'}
                  </p>
                  <p className="text-hospital-gray-700">
                    End Date: {medication.endDate ? format(new Date(medication.endDate), 'MM/dd/yyyy') : 'N/A'}
                  </p>
                  <p className="text-hospital-gray-700">Current: {medication.isCurrent ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          )}

          {record.socialHistory && (
            <div>
              <h2 className="card-title">Social History</h2>
              <p className="text-hospital-gray-700">Smoking Status: {record.socialHistory.smokingStatus || 'N/A'}</p>
              <p className="text-hospital-gray-700">Alcohol Use: {record.socialHistory.alcoholUse || 'N/A'}</p>
              <p className="text-hospital-gray-700">Occupation: {record.socialHistory.occupation || 'N/A'}</p>
              <p className="text-hospital-gray-700">Marital Status: {record.socialHistory.maritalStatus || 'N/A'}</p>
              <p className="text-hospital-gray-700">Living Situation: {record.socialHistory.livingSituation || 'N/A'}</p>
            </div>
          )}

          {record.reviewOfSystems?.length > 0 && (
            <div>
              <h2 className="card-title">Review of Systems</h2>
              {record.reviewOfSystems.map((review, index) => (
                <div key={index} className="ml-4 border-l-2 border-hospital-gray-200 pl-4 mb-4">
                  <p className="text-hospital-gray-700">System: {review.system || 'N/A'}</p>
                  <p className="text-hospital-gray-700">Findings: {review.findings || 'N/A'}</p>
                </div>
              ))}
            </div>
          )}

          {record.immunizations?.length > 0 && (
            <div>
              <h2 className="card-title">Immunizations</h2>
              {record.immunizations.map((immunization, index) => (
                <div key={index} className="ml-4 border-l-2 border-hospital-gray-200 pl-4 mb-4">
                  <p className="text-hospital-gray-700">Vaccine: {immunization.vaccine || 'N/A'}</p>
                  <p className="text-hospital-gray-700">
                    Date Given: {immunization.dateGiven ? format(new Date(immunization.dateGiven), 'MM/dd/yyyy') : 'N/A'}
                  </p>
                  <p className="text-hospital-gray-700">Administered By: {immunization.administeredBy || 'N/A'}</p>
                  <p className="text-hospital-gray-700">Notes: {immunization.notes || 'N/A'}</p>
                </div>
              ))}
            </div>
          )}

          {record.travelHistory?.length > 0 && (
            <div>
              <h2 className="card-title">Travel History</h2>
              {record.travelHistory.map((travel, index) => (
                <div key={index} className="ml-4 border-l-2 border-hospital-gray-200 pl-4 mb-4">
                  <p className="text-hospital-gray-700">Country Visited: {travel.countryVisited || 'N/A'}</p>
                  <p className="text-hospital-gray-700">
                    Date From: {travel.dateFrom ? format(new Date(travel.dateFrom), 'MM/dd/yyyy') : 'N/A'}
                  </p>
                  <p className="text-hospital-gray-700">
                    Date To: {travel.dateTo ? format(new Date(travel.dateTo), 'MM/dd/yyyy') : 'N/A'}
                  </p>
                  <p className="text-hospital-gray-700">Purpose: {travel.purpose || 'N/A'}</p>
                  <p className="text-hospital-gray-700">Notes: {travel.travelNotes || 'N/A'}</p>
                </div>
              ))}
            </div>
          )}

          {record.allergies?.length > 0 && (
            <div>
              <h2 className="card-title">Allergies</h2>
              {record.allergies.map((allergy, index) => (
                <div key={index} className="ml-4 border-l-2 border-hospital-gray-200 pl-4 mb-4">
                  <p className="text-hospital-gray-700">Name: {allergy.name || 'N/A'}</p>
                  <p className="text-hospital-gray-700">Severity: {allergy.severity || 'N/A'}</p>
                </div>
              ))}
            </div>
          )}

          {record.diagnoses?.length > 0 && (
            <div>
              <h2 className="card-title">Diagnoses</h2>
              {record.diagnoses.map((diagnosis, index) => (
                <div key={index} className="ml-4 border-l-2 border-hospital-gray-200 pl-4 mb-4">
                  <p className="text-hospital-gray-700">Code: {diagnosis.code || 'N/A'}</p>
                  <p className="text-hospital-gray-700">Description: {diagnosis.description || 'N/A'}</p>
                  <p className="text-hospital-gray-700">
                    Diagnosed At: {diagnosis.diagnosedAt ? format(new Date(diagnosis.diagnosedAt), 'MM/dd/yyyy') : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {record.vitalSigns?.length > 0 && (
            <div>
              <h2 className="card-title">Vital Signs</h2>
              {record.vitalSigns.map((vital, index) => (
                <div key={index} className="ml-4 border-l-2 border-hospital-gray-200 pl-4 mb-4">
                  <p className="text-hospital-gray-700">Blood Pressure: {vital.bloodPressure || 'N/A'}</p>
                  <p className="text-hospital-gray-700">Heart Rate: {vital.heartRate || 'N/A'}</p>
                  <p className="text-hospital-gray-700">Temperature: {vital.temperature || 'N/A'}</p>
                  <p className="text-hospital-gray-700">Respiratory Rate: {vital.respiratoryRate || 'N/A'}</p>
                  <p className="text-hospital-gray-700">Oxygen Saturation: {vital.oxygenSaturation || 'N/A'}</p>
                  <p className="text-hospital-gray-700">
                    Recorded At: {vital.recordedAt ? format(new Date(vital.recordedAt), 'MM/dd/yyyy') : 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}