import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllMedicalRecords(filters = {}) {
  try {
    const medicalRecords = await prisma.medicalRecord.findMany({
      where: {
        ...(filters.patientId && { patientId: filters.patientId }),
        ...(filters.dateFrom && filters.dateTo && {
          recordDate: {
            gte: new Date(filters.dateFrom),
            lte: new Date(filters.dateTo),
          },
        }),
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        allergies: true,
        diagnoses: true,
        vitalSigns: true,
        chiefComplaint: true,
        presentIllness: true,
        pastConditions: true,
        surgicalHistory: true,
        familyHistory: true,
        medicationHistory: true,
        socialHistory: true,
        reviewOfSystems: true,
        immunizations: true,
        travelHistory: true
      },
      orderBy: { recordDate: 'desc' }
    });

    return medicalRecords.map(record => ({
      ...record,
      patient: record.patient ? {
        ...record.patient,
        name: `${record.patient.firstName} ${record.patient.lastName}`
      } : null
    }));
  } catch (error) {
    console.error('Error fetching medical records:', error);
    throw error;
  }
}

export async function getMedicalRecordById(id) {
  try {
    const medicalRecord = await prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        allergies: true,
        diagnoses: true,
        vitalSigns: true,
        chiefComplaint: true,
        presentIllness: true,
        pastConditions: true,
        surgicalHistory: true,
        familyHistory: true,
        medicationHistory: true,
        socialHistory: true,
        reviewOfSystems: true,
        immunizations: true,
        travelHistory: true
      }
    });

    if (!medicalRecord) {
      throw new Error('Medical record not found');
    }

    return {
      ...medicalRecord,
      patient: medicalRecord.patient ? {
        ...medicalRecord.patient,
        name: `${medicalRecord.patient.firstName} ${medicalRecord.patient.lastName}`
      } : null
    };
  } catch (error) {
    console.error('Error fetching medical record:', error);
    throw error;
  }
}

export async function createMedicalRecord(data) {
  try {
    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        patientId: data.patientId,
        recordDate: new Date(data.recordDate),
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return {
      ...medicalRecord,
      patient: medicalRecord.patient ? {
        ...medicalRecord.patient,
        name: `${medicalRecord.patient.firstName} ${medicalRecord.patient.lastName}`
      } : null
    };
  } catch (error) {
    console.error('Error creating medical record:', error);
    throw error;
  }
}

export async function updateMedicalRecord(id, data) {
  try {
    const medicalRecord = await prisma.medicalRecord.update({
      where: { id },
      data: {
        recordDate: new Date(data.recordDate)
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return {
      ...medicalRecord,
      patient: medicalRecord.patient ? {
        ...medicalRecord.patient,
        name: `${medicalRecord.patient.firstName} ${medicalRecord.patient.lastName}`
      } : null
    };
  } catch (error) {
    console.error('Error updating medical record:', error);
    throw error;
  }
}

export async function deleteMedicalRecord(id) {
  try {
    return await prisma.medicalRecord.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    throw error;
  }
}

export async function getAllergies(patientId) {
  try {
    return await prisma.allergy.findMany({
      where: { medicalRecord: { patientId } },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching allergies:', error);
    throw error;
  }
}

export async function getAllergyById(id) {
  try {
    const allergy = await prisma.allergy.findUnique({
      where: { id }
    });
    if (!allergy) {
      throw new Error('Allergy not found');
    }
    return allergy;
  } catch (error) {
    console.error('Error fetching allergy:', error);
    throw error;
  }
}

export async function createAllergy(data) {
  try {
    return await prisma.allergy.create({
      data: {
        medicalRecordId: data.medicalRecordId,
        name: data.name,
        severity: data.severity
      }
    });
  } catch (error) {
    console.error('Error creating allergy:', error);
    throw error;
  }
}

export async function updateAllergy(id, data) {
  try {
    return await prisma.allergy.update({
      where: { id },
      data: {
        name: data.name,
        severity: data.severity
      }
    });
  } catch (error) {
    console.error('Error updating allergy:', error);
    throw error;
  }
}

export async function deleteAllergy(id) {
  try {
    return await prisma.allergy.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting allergy:', error);
    throw error;
  }
}

export async function getDiagnoses(patientId) {
  try {
    return await prisma.diagnosis.findMany({
      where: { medicalRecord: { patientId } },
      orderBy: { diagnosedAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching diagnoses:', error);
    throw error;
  }
}

export async function getDiagnosisById(id) {
  try {
    const diagnosis = await prisma.diagnosis.findUnique({
      where: { id }
    });
    if (!diagnosis) {
      throw new Error('Diagnosis not found');
    }
    return diagnosis;
  } catch (error) {
    console.error('Error fetching diagnosis:', error);
    throw error;
  }
}

export async function createDiagnosis(data) {
  try {
    return await prisma.diagnosis.create({
      data: {
        medicalRecordId: data.medicalRecordId,
        code: data.code,
        description: data.description,
        diagnosedAt: new Date(data.diagnosedAt)
      }
    });
  } catch (error) {
    console.error('Error creating diagnosis:', error);
    throw error;
  }
}

export async function updateDiagnosis(id, data) {
  try {
    return await prisma.diagnosis.update({
      where: { id },
      data: {
        code: data.code,
        description: data.description,
        diagnosedAt: new Date(data.diagnosedAt)
      }
    });
  } catch (error) {
    console.error('Error updating diagnosis:', error);
    throw error;
  }
}

export async function deleteDiagnosis(id) {
  try {
    return await prisma.diagnosis.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting diagnosis:', error);
    throw error;
  }
}

export async function getVitalSigns(patientId) {
  try {
    return await prisma.vitalSign.findMany({
      where: { medicalRecord: { patientId } },
      orderBy: { recordedAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching vital signs:', error);
    throw error;
  }
}

export async function getVitalSignById(id) {
  try {
    const vitalSign = await prisma.vitalSign.findUnique({
      where: { id }
    });
    if (!vitalSign) {
      throw new Error('Vital sign not found');
    }
    return vitalSign;
  } catch (error) {
    console.error('Error fetching vital sign:', error);
    throw error;
  }
}

export async function createVitalSign(data) {
  try {
    return await prisma.vitalSign.create({
      data: {
        medicalRecordId: data.medicalRecordId,
        bloodPressure: data.bloodPressure,
        heartRate: data.heartRate,
        temperature: data.temperature,
        respiratoryRate: data.respiratoryRate,
        oxygenSaturation: data.oxygenSaturation,
        recordedAt: new Date(data.recordedAt)
      }
    });
  } catch (error) {
    console.error('Error creating vital sign:', error);
    throw error;
  }
}

export async function updateVitalSign(id, data) {
  try {
    return await prisma.vitalSign.update({
      where: { id },
      data: {
        bloodPressure: data.bloodPressure,
        heartRate: data.heartRate,
        temperature: data.temperature,
        respiratoryRate: data.respiratoryRate,
        oxygenSaturation: data.oxygenSaturation,
        recordedAt: new Date(data.recordedAt)
      }
    });
  } catch (error) {
    console.error('Error updating vital sign:', error);
    throw error;
  }
}

export async function deleteVitalSign(id) {
  try {
    return await prisma.vitalSign.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting vital sign:', error);
    throw error;
  }
}

export async function getChiefComplaints(patientId) {
  try {
    return await prisma.chiefComplaint.findMany({
      where: { medicalRecord: { patientId } },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching chief complaints:', error);
    throw error;
  }
}

export async function getChiefComplaintById(id) {
  try {
    const chiefComplaint = await prisma.chiefComplaint.findUnique({
      where: { id }
    });
    if (!chiefComplaint) {
      throw new Error('Chief complaint not found');
    }
    return chiefComplaint;
  } catch (error) {
    console.error('Error fetching chief complaint:', error);
    throw error;
  }
}

export async function createChiefComplaint(data) {
  try {
    return await prisma.chiefComplaint.create({
      data: {
        medicalRecordId: data.medicalRecordId,
        description: data.description,
        duration: data.duration,
        onset: data.onset
      }
    });
  } catch (error) {
    console.error('Error creating chief complaint:', error);
    throw error;
  }
}

export async function updateChiefComplaint(id, data) {
  try {
    return await prisma.chiefComplaint.update({
      where: { id },
      data: {
        description: data.description,
        duration: data.duration,
        onset: data.onset
      }
    });
  } catch (error) {
    console.error('Error updating chief complaint:', error);
    throw error;
  }
}

export async function deleteChiefComplaint(id) {
  try {
    return await prisma.chiefComplaint.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting chief complaint:', error);
    throw error;
  }
}

export async function getPresentIllnesses(patientId) {
  try {
    return await prisma.presentIllness.findMany({
      where: { medicalRecord: { patientId } },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching present illnesses:', error);
    throw error;
  }
}

export async function getPresentIllnessById(id) {
  try {
    const presentIllness = await prisma.presentIllness.findUnique({
      where: { id }
    });
    if (!presentIllness) {
      throw new Error('Present illness not found');
    }
    return presentIllness;
  } catch (error) {
    console.error('Error fetching present illness:', error);
    throw error;
  }
}

export async function createPresentIllness(data) {
  try {
    return await prisma.presentIllness.create({
      data: {
        medicalRecordId: data.medicalRecordId,
        narrative: data.narrative,
        severity: data.severity,
        progress: data.progress,
        associatedSymptoms: data.associatedSymptoms
      }
    });
  } catch (error) {
    console.error('Error creating present illness:', error);
    throw error;
  }
}

export async function updatePresentIllness(id, data) {
  try {
    return await prisma.presentIllness.update({
      where: { id },
      data: {
        narrative: data.narrative,
        severity: data.severity,
        progress: data.progress,
        associatedSymptoms: data.associatedSymptoms
      }
    });
  } catch (error) {
    console.error('Error updating present illness:', error);
    throw error;
  }
}

export async function deletePresentIllness(id) {
  try {
    return await prisma.presentIllness.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting present illness:', error);
    throw error;
  }
}

export async function getPastConditions(patientId) {
  try {
    return await prisma.pastMedicalCondition.findMany({
      where: { medicalRecord: { patientId } },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching past conditions:', error);
    throw error;
  }
}

export async function getPastConditionById(id) {
  try {
    const pastCondition = await prisma.pastMedicalCondition.findUnique({
      where: { id }
    });
    if (!pastCondition) {
      throw new Error('Past condition not found');
    }
    return pastCondition;
  } catch (error) {
    console.error('Error fetching past condition:', error);
    throw error;
  }
}

export async function createPastCondition(data) {
  try {
    return await prisma.pastMedicalCondition.create({
      data: {
        medicalRecordId: data.medicalRecordId,
        condition: data.condition,
        diagnosisDate: data.diagnosisDate ? new Date(data.diagnosisDate) : null,
        notes: data.notes
      }
    });
  } catch (error) {
    console.error('Error creating past condition:', error);
    throw error;
  }
}

export async function updatePastCondition(id, data) {
  try {
    return await prisma.pastMedicalCondition.update({
      where: { id },
      data: {
        condition: data.condition,
        diagnosisDate: data.diagnosisDate ? new Date(data.diagnosisDate) : null,
        notes: data.notes
      }
    });
  } catch (error) {
    console.error('Error updating past condition:', error);
    throw error;
  }
}

export async function deletePastCondition(id) {
  try {
    return await prisma.pastMedicalCondition.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting past condition:', error);
    throw error;
  }
}

export async function getSurgicalHistory(patientId) {
  try {
    return await prisma.surgicalHistory.findMany({
      where: { medicalRecord: { patientId } },
      orderBy: { datePerformed: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching surgical history:', error);
    throw error;
  }
}

export async function getSurgicalHistoryById(id) {
  try {
    const surgicalHistory = await prisma.surgicalHistory.findUnique({
      where: { id }
    });
    if (!surgicalHistory) {
      throw new Error('Surgical history not found');
    }
    return surgicalHistory;
  } catch (error) {
    console.error('Error fetching surgical history:', error);
    throw error;
  }
}

export async function createSurgicalHistory(data) {
  try {
    return await prisma.surgicalHistory.create({
      data: {
        medicalRecordId: data.medicalRecordId,
        procedure: data.procedure,
        datePerformed: data.datePerformed ? new Date(data.datePerformed) : null,
        outcome: data.outcome,
        notes: data.notes
      }
    });
  } catch (error) {
    console.error('Error creating surgical history:', error);
    throw error;
  }
}

export async function updateSurgicalHistory(id, data) {
  try {
    return await prisma.surgicalHistory.update({
      where: { id },
      data: {
        procedure: data.procedure,
        datePerformed: data.datePerformed ? new Date(data.datePerformed) : null,
        outcome: data.outcome,
        notes: data.notes
      }
    });
  } catch (error) {
    console.error('Error updating surgical history:', error);
    throw error;
  }
}

export async function deleteSurgicalHistory(id) {
  try {
    return await prisma.surgicalHistory.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting surgical history:', error);
    throw error;
  }
}

export async function getFamilyHistory(patientId) {
  try {
    return await prisma.familyHistory.findMany({
      where: { medicalRecord: { patientId } },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching family history:', error);
    throw error;
  }
}

export async function getFamilyHistoryById(id) {
  try {
    const familyHistory = await prisma.familyHistory.findUnique({
      where: { id }
    });
    if (!familyHistory) {
      throw new Error('Family history not found');
    }
    return familyHistory;
  } catch (error) {
    console.error('Error fetching family history:', error);
    throw error;
  }
}

export async function createFamilyHistory(data) {
  try {
    return await prisma.familyHistory.create({
      data: {
        medicalRecordId: data.medicalRecordId,
        relative: data.relative,
        condition: data.condition,
        ageAtDiagnosis: data.ageAtDiagnosis,
        notes: data.notes
      }
    });
  } catch (error) {
    console.error('Error creating family history:', error);
    throw error;
  }
}

export async function updateFamilyHistory(id, data) {
  try {
    return await prisma.familyHistory.update({
      where: { id },
      data: {
        relative: data.relative,
        condition: data.condition,
        ageAtDiagnosis: data.ageAtDiagnosis,
        notes: data.notes
      }
    });
  } catch (error) {
    console.error('Error updating family history:', error);
    throw error;
  }
}

export async function deleteFamilyHistory(id) {
  try {
    return await prisma.familyHistory.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting family history:', error);
    throw error;
  }
}

export async function getMedicationHistory(patientId) {
  try {
    return await prisma.medicationHistory.findMany({
      where: { medicalRecord: { patientId } },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching medication history:', error);
    throw error;
  }
}

export async function getMedicationHistoryById(id) {
  try {
    const medicationHistory = await prisma.medicationHistory.findUnique({
      where: { id }
    });
    if (!medicationHistory) {
      throw new Error('Medication history not found');
    }
    return medicationHistory;
  } catch (error) {
    console.error('Error fetching medication history:', error);
    throw error;
  }
}

export async function createMedicationHistory(data) {
  try {
    return await prisma.medicationHistory.create({
      data: {
        medicalRecordId: data.medicalRecordId,
        medicationName: data.medicationName,
        dosage: data.dosage,
        frequency: data.frequency,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: data.isCurrent
      }
    });
  } catch (error) {
    console.error('Error creating medication history:', error);
    throw error;
  }
}

export async function updateMedicationHistory(id, data) {
  try {
    return await prisma.medicationHistory.update({
      where: { id },
      data: {
        medicationName: data.medicationName,
        dosage: data.dosage,
        frequency: data.frequency,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isCurrent: data.isCurrent
      }
    });
  } catch (error) {
    console.error('Error updating medication history:', error);
    throw error;
  }
}

export async function deleteMedicationHistory(id) {
  try {
    return await prisma.medicationHistory.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting medication history:', error);
    throw error;
  }
}

export async function getSocialHistory(patientId) {
  try {
    return await prisma.socialHistory.findMany({
      where: { medicalRecord: { patientId } },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching social history:', error);
    throw error;
  }
}

export async function getSocialHistoryById(id) {
  try {
    const socialHistory = await prisma.socialHistory.findUnique({
      where: { id }
    });
    if (!socialHistory) {
      throw new Error('Social history not found');
    }
    return socialHistory;
  } catch (error) {
    console.error('Error fetching social history:', error);
    throw error;
  }
}

export async function createSocialHistory(data) {
  try {
    return await prisma.socialHistory.create({
      data: {
        medicalRecordId: data.medicalRecordId,
        smokingStatus: data.smokingStatus,
        alcoholUse: data.alcoholUse,
        occupation: data.occupation,
        maritalStatus: data.maritalStatus,
        livingSituation: data.livingSituation
      }
    });
  } catch (error) {
    console.error('Error creating social history:', error);
    throw error;
  }
}

export async function updateSocialHistory(id, data) {
  try {
    return await prisma.socialHistory.update({
      where: { id },
      data: {
        smokingStatus: data.smokingStatus,
        alcoholUse: data.alcoholUse,
        occupation: data.occupation,
        maritalStatus: data.maritalStatus,
        livingSituation: data.livingSituation
      }
    });
  } catch (error) {
    console.error('Error updating social history:', error);
    throw error;
  }
}

export async function deleteSocialHistory(id) {
  try {
    return await prisma.socialHistory.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting social history:', error);
    throw error;
  }
}

export async function getReviewOfSystems(patientId) {
  try {
    return await prisma.reviewOfSystems.findMany({
      where: { medicalRecord: { patientId } },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching review of systems:', error);
    throw error;
  }
}

export async function getReviewOfSystemsById(id) {
  try {
    const reviewOfSystems = await prisma.reviewOfSystems.findUnique({
      where: { id }
    });
    if (!reviewOfSystems) {
      throw new Error('Review of systems not found');
    }
    return reviewOfSystems;
  } catch (error) {
    console.error('Error fetching review of systems:', error);
    throw error;
  }
}

export async function createReviewOfSystems(data) {
  try {
    return await prisma.reviewOfSystems.create({
      data: {
        medicalRecordId: data.medicalRecordId,
        system: data.system,
        findings: data.findings
      }
    });
  } catch (error) {
    console.error('Error creating review of systems:', error);
    throw error;
  }
}

export async function updateReviewOfSystems(id, data) {
  try {
    return await prisma.reviewOfSystems.update({
      where: { id },
      data: {
        system: data.system,
        findings: data.findings
      }
    });
  } catch (error) {
    console.error('Error updating review of systems:', error);
    throw error;
  }
}

export async function deleteReviewOfSystems(id) {
  try {
    return await prisma.reviewOfSystems.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting review of systems:', error);
    throw error;
  }
}

export async function getImmunizations(patientId) {
  try {
    return await prisma.immunization.findMany({
      where: { medicalRecord: { patientId } },
      orderBy: { dateGiven: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching immunizations:', error);
    throw error;
  }
}

export async function getImmunizationById(id) {
  try {
    const immunization = await prisma.immunization.findUnique({
      where: { id }
    });
    if (!immunization) {
      throw new Error('Immunization not found');
    }
    return immunization;
  } catch (error) {
    console.error('Error fetching immunization:', error);
    throw error;
  }
}

export async function createImmunization(data) {
  try {
    return await prisma.immunization.create({
      data: {
        medicalRecordId: data.medicalRecordId,
        vaccine: data.vaccine,
        dateGiven: new Date(data.dateGiven),
        administeredBy: data.administeredBy,
        notes: data.notes
      }
    });
  } catch (error) {
    console.error('Error creating immunization:', error);
    throw error;
  }
}

export async function updateImmunization(id, data) {
  try {
    return await prisma.immunization.update({
      where: { id },
      data: {
        vaccine: data.vaccine,
        dateGiven: new Date(data.dateGiven),
        administeredBy: data.administeredBy,
        notes: data.notes
      }
    });
  } catch (error) {
    console.error('Error updating immunization:', error);
    throw error;
  }
}

export async function deleteImmunization(id) {
  try {
    return await prisma.immunization.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting immunization:', error);
    throw error;
  }
}

export async function getTravelHistory(patientId) {
  try {
    return await prisma.travelHistory.findMany({
      where: { medicalRecord: { patientId } },
      orderBy: { dateFrom: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching travel history:', error);
    throw error;
  }
}

export async function getTravelHistoryById(id) {
  try {
    const travelHistory = await prisma.travelHistory.findUnique({
      where: { id }
    });
    if (!travelHistory) {
      throw new Error('Travel history not found');
    }
    return travelHistory;
  } catch (error) {
    console.error('Error fetching travel history:', error);
    throw error;
  }
}

export async function createTravelHistory(data) {
  try {
    return await prisma.travelHistory.create({
      data: {
        medicalRecordId: data.medicalRecordId,
        countryVisited: data.countryVisited,
        dateFrom: data.dateFrom ? new Date(data.dateFrom) : null,
        dateTo: data.dateTo ? new Date(data.dateTo) : null,
        purpose: data.purpose,
        travelNotes: data.travelNotes
      }
    });
  } catch (error) {
    console.error('Error creating travel history:', error);
    throw error;
  }
}

export async function updateTravelHistory(id, data) {
  try {
    return await prisma.travelHistory.update({
      where: { id },
      data: {
        countryVisited: data.countryVisited,
        dateFrom: data.dateFrom ? new Date(data.dateFrom) : null,
        dateTo: data.dateTo ? new Date(data.dateTo) : null,
        purpose: data.purpose,
        travelNotes: data.travelNotes
      }
    });
  } catch (error) {
    console.error('Error updating travel history:', error);
    throw error;
  }
}

export async function deleteTravelHistory(id) {
  try {
    return await prisma.travelHistory.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting travel history:', error);
    throw error;
  }
}

export async function bulkCreateMedicalRecords(records) {
  try {
    const createdRecords = await prisma.$transaction(
      records.map(record =>
        prisma.medicalRecord.create({
          data: {
            patientId: record.patientId,
            recordDate: new Date(record.recordDate),
          },
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        })
      )
    );

    return createdRecords.map(record => ({
      ...record,
      patient: record.patient ? {
        ...record.patient,
        name: `${record.patient.firstName} ${record.patient.lastName}`
      } : null
    }));
  } catch (error) {
    console.error('Error bulk creating medical records:', error);
    throw error;
  }
}

export async function getMedicalRecordStats(filters = {}) {
  try {
    const where = {
      ...(filters.patientId && { patientId: filters.patientId }),
      ...(filters.dateFrom && filters.dateTo && {
        recordDate: {
          gte: new Date(filters.dateFrom),
          lte: new Date(filters.dateTo),
        },
      }),
    };

    const [totalRecords, totalAllergies, totalDiagnoses, totalVitalSigns] = await Promise.all([
      prisma.medicalRecord.count({ where }),
      prisma.allergy.count({ where: { medicalRecord: where } }),
      prisma.diagnosis.count({ where: { medicalRecord: where } }),
      prisma.vitalSign.count({ where: { medicalRecord: where } }),
    ]);

    return {
      totalRecords,
      totalAllergies,
      totalDiagnoses,
      totalVitalSigns,
      averageRecordsPerPatient: totalRecords > 0 ? totalRecords / await prisma.patient.count() : 0
    };
  } catch (error) {
    console.error('Error fetching medical record stats:', error);
    throw error;
  }
}

export async function getRecentMedicalRecords(limit = 10) {
  try {
    const medicalRecords = await prisma.medicalRecord.findMany({
      where: {
        recordDate: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { recordDate: 'desc' },
      take: limit
    });

    return medicalRecords.map(record => ({
      ...record,
      patient: record.patient ? {
        ...record.patient,
        name: `${record.patient.firstName} ${record.patient.lastName}`
      } : null
    }));
  } catch (error) {
    console.error('Error fetching recent medical records:', error);
    throw error;
  }
}

const medicalRecordsService = {
  getAllMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
  getAllergies,
  getAllergyById,
  createAllergy,
  updateAllergy,
  deleteAllergy,
  getDiagnoses,
  getDiagnosisById,
  createDiagnosis,
  updateDiagnosis,
  deleteDiagnosis,
  getVitalSigns,
  getVitalSignById,
  createVitalSign,
  updateVitalSign,
  deleteVitalSign,
  getChiefComplaints,
  getChiefComplaintById,
  createChiefComplaint,
  updateChiefComplaint,
  deleteChiefComplaint,
  getPresentIllnesses,
  getPresentIllnessById,
  createPresentIllness,
  updatePresentIllness,
  deletePresentIllness,
  getPastConditions,
  getPastConditionById,
  createPastCondition,
  updatePastCondition,
  deletePastCondition,
  getSurgicalHistory,
  getSurgicalHistoryById,
  createSurgicalHistory,
  updateSurgicalHistory,
  deleteSurgicalHistory,
  getFamilyHistory,
  getFamilyHistoryById,
  createFamilyHistory,
  updateFamilyHistory,
  deleteFamilyHistory,
  getMedicationHistory,
  getMedicationHistoryById,
  createMedicationHistory,
  updateMedicationHistory,
  deleteMedicationHistory,
  getSocialHistory,
  getSocialHistoryById,
  createSocialHistory,
  updateSocialHistory,
  deleteSocialHistory,
  getReviewOfSystems,
  getReviewOfSystemsById,
  createReviewOfSystems,
  updateReviewOfSystems,
  deleteReviewOfSystems,
  getImmunizations,
  getImmunizationById,
  createImmunization,
  updateImmunization,
  deleteImmunization,
  getTravelHistory,
  getTravelHistoryById,
  createTravelHistory,
  updateTravelHistory,
  deleteTravelHistory,
  bulkCreateMedicalRecords,
  getMedicalRecordStats,
  getRecentMedicalRecords
};

export default medicalRecordsService;