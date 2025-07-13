import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const authenticate = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '');
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

export async function GET(request, { params }) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource');

  try {
    if (resource) {
      const queries = {
        allergy: () => prisma.allergy.findUnique({ where: { id } }),
        diagnosis: () => prisma.diagnosis.findUnique({ where: { id } }),
        vitalSign: () => prisma.vitalSign.findUnique({ where: { id } }),
        chiefComplaint: () => prisma.chiefComplaint.findUnique({ where: { id } }),
        presentIllness: () => prisma.presentIllness.findUnique({ where: { id } }),
        pastCondition: () => prisma.pastMedicalCondition.findUnique({ where: { id } }),
        surgicalHistory: () => prisma.surgicalHistory.findUnique({ where: { id } }),
        familyHistory: () => prisma.familyHistory.findUnique({ where: { id } }),
        medicationHistory: () => prisma.medicationHistory.findUnique({ where: { id } }),
        socialHistory: () => prisma.socialHistory.findUnique({ where: { id } }),
        reviewOfSystems: () => prisma.reviewOfSystems.findUnique({ where: { id } }),
        immunization: () => prisma.immunization.findUnique({ where: { id } }),
        travelHistory: () => prisma.travelHistory.findUnique({ where: { id } })
      };

      if (queries[resource]) {
        const result = await queries[resource]();
        if (!result) return NextResponse.json({ error: `${resource} not found` }, { status: 404 });
        return NextResponse.json(result);
      }
      return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
    }

    const medicalRecord = await prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true } },
        doctor: { select: { id: true, firstName: true, lastName: true, department: { select: { name: true } } } },
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
      return NextResponse.json({ error: 'Medical record not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...medicalRecord,
      patient: medicalRecord.patient ? { ...medicalRecord.patient, name: `${medicalRecord.patient.firstName} ${medicalRecord.patient.lastName}` } : null,
      doctor: medicalRecord.doctor ? { ...medicalRecord.doctor, name: `${medicalRecord.doctor.firstName} ${medicalRecord.doctor.lastName}` } : null
    });
  } catch (error) {
    console.error('Error in medical record API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  try {
    const data = await request.json();
    const { resource, ...updateData } = data;

    const updateOperations = {
      medicalRecord: () => prisma.medicalRecord.update({
        where: { id },
        data: {
          patientId: updateData.patientId,
          doctorId: updateData.doctorId,
          recordDate: new Date(updateData.recordDate),
          updatedAt: new Date()
        },
        include: {
          patient: { select: { id: true, firstName: true, lastName: true } },
          doctor: { select: { id: true, firstName: true, lastName: true, department: { select: { name: true } } } }
        }
      }),
      allergy: () => prisma.allergy.update({ where: { id }, data: { name: updateData.name, severity: updateData.severity, updatedAt: new Date() } }),
      diagnosis: () => prisma.diagnosis.update({ where: { id }, data: { code: updateData.code, description: updateData.description, diagnosedAt: new Date(updateData.diagnosedAt), updatedAt: new Date() } }),
      vitalSign: () => prisma.vitalSign.update({
        where: { id },
        data: {
          bloodPressure: updateData.bloodPressure,
          heartRate: parseInt(updateData.heartRate),
          temperature: parseFloat(updateData.temperature),
          respiratoryRate: parseInt(updateData.respiratoryRate),
          oxygenSaturation: parseFloat(updateData.oxygenSaturation),
          recordedAt: new Date(updateData.recordedAt),
          updatedAt: new Date()
        }
      }),
      chiefComplaint: () => prisma.chiefComplaint.update({ where: { id }, data: { description: updateData.description, duration: updateData.duration, onset: updateData.onset, updatedAt: new Date() } }),
      presentIllness: () => prisma.presentIllness.update({ where: { id }, data: { narrative: updateData.narrative, severity: updateData.severity, progress: updateData.progress, associatedSymptoms: updateData.associatedSymptoms, updatedAt: new Date() } }),
      pastCondition: () => prisma.pastMedicalCondition.update({ where: { id }, data: { condition: updateData.condition, diagnosisDate: updateData.diagnosisDate ? new Date(updateData.diagnosisDate) : null, notes: updateData.notes, updatedAt: new Date() } }),
      surgicalHistory: () => prisma.surgicalHistory.update({ where: { id }, data: { procedure: updateData.procedure, datePerformed: updateData.datePerformed ? new Date(updateData.datePerformed) : null, outcome: updateData.outcome, notes: updateData.notes, updatedAt: new Date() } }),
      familyHistory: () => prisma.familyHistory.update({ where: { id }, data: { relative: updateData.relative, condition: updateData.condition, ageAtDiagnosis: parseInt(updateData.ageAtDiagnosis), notes: updateData.notes, updatedAt: new Date() } }),
      medicationHistory: () => prisma.medicationHistory.update({
        where: { id },
        data: {
          medicationName: updateData.medicationName,
          dosage: updateData.dosage,
          frequency: updateData.frequency,
          startDate: updateData.startDate ? new Date(updateData.startDate) : null,
          endDate: updateData.endDate ? new Date(updateData.endDate) : null,
          isCurrent: updateData.isCurrent,
          updatedAt: new Date()
        }
      }),
      socialHistory: () => prisma.socialHistory.update({ where: { id }, data: { smokingStatus: updateData.smokingStatus, alcoholUse: updateData.alcoholUse, occupation: updateData.occupation, maritalStatus: updateData.maritalStatus, livingSituation: updateData.livingSituation, updatedAt: new Date() } }),
      reviewOfSystems: () => prisma.reviewOfSystems.update({ where: { id }, data: { system: updateData.system, findings: updateData.findings, updatedAt: new Date() } }),
      immunization: () => prisma.immunization.update({ where: { id }, data: { vaccine: updateData.vaccine, dateGiven: new Date(updateData.dateGiven), administeredBy: updateData.administeredBy, notes: updateData.notes, updatedAt: new Date() } }),
      travelHistory: () => prisma.travelHistory.update({ where: { id }, data: { countryVisited: updateData.countryVisited, dateFrom: updateData.dateFrom ? new Date(updateData.dateFrom) : null, dateTo: updateData.dateTo ? new Date(updateData.dateTo) : null, purpose: updateData.purpose, travelNotes: updateData.travelNotes, updatedAt: new Date() } })
    };

    if (updateOperations[resource]) {
      const result = await updateOperations[resource]();
      if (resource === 'medicalRecord') {
        return NextResponse.json({
          ...result,
          patient: result.patient ? { ...result.patient, name: `${result.patient.firstName} ${result.patient.lastName}` } : null,
          doctor: result.doctor ? { ...result.doctor, name: `${result.doctor.firstName} ${result.doctor.lastName}` } : null
        });
      }
      return NextResponse.json(result);
    }
    return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
  } catch (error) {
    console.error('Error updating medical record:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = params;
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource');

  try {
    if (!resource) {
      await prisma.medicalRecord.delete({ where: { id } });
      return NextResponse.json({ message: 'Medical record deleted' });
    }

    const deleteOperations = {
      allergy: () => prisma.allergy.delete({ where: { id } }),
      diagnosis: () => prisma.diagnosis.delete({ where: { id } }),
      vitalSign: () => prisma.vitalSign.delete({ where: { id } }),
      chiefComplaint: () => prisma.chiefComplaint.delete({ where: { id } }),
      presentIllness: () => prisma.presentIllness.delete({ where: { id } }),
      pastCondition: () => prisma.pastMedicalCondition.delete({ where: { id } }),
      surgicalHistory: () => prisma.surgicalHistory.delete({ where: { id } }),
      familyHistory: () => prisma.familyHistory.delete({ where: { id } }),
      medicationHistory: () => prisma.medicationHistory.delete({ where: { id } }),
      socialHistory: () => prisma.socialHistory.delete({ where: { id } }),
      reviewOfSystems: () => prisma.reviewOfSystems.delete({ where: { id } }),
      immunization: () => prisma.immunization.delete({ where: { id } }),
      travelHistory: () => prisma.travelHistory.delete({ where: { id } })
    };

    if (deleteOperations[resource]) {
      await deleteOperations[resource]();
      return NextResponse.json({ message: `${resource} deleted` });
    }
    return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}