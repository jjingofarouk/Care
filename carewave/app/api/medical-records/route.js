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

export async function GET(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');
  const resource = searchParams.get('resource');
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  try {
    if (resource) {
      const queries = {
        patients: () => prisma.patient.findMany({
          select: { id: true, firstName: true, lastName: true },
          orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }]
        }),
        doctors: () => prisma.doctor.findMany({
          select: { id: true, firstName: true, lastName: true, department: { select: { name: true } } },
          orderBy: [{ firstName: 'asc' }, { lastName: 'asc' }]
        }),
        allergies: () => prisma.allergy.findMany({
          where: { medicalRecord: { patientId } },
          orderBy: { createdAt: 'desc' }
        }),
        diagnoses: () => prisma.diagnosis.findMany({
          where: { medicalRecord: { patientId } },
          orderBy: { diagnosedAt: 'desc' }
        }),
        vitalSigns: () => prisma.vitalSign.findMany({
          where: { medicalRecord: { patientId } },
          orderBy: { recordedAt: 'desc' }
        }),
        chiefComplaints: () => prisma.chiefComplaint.findMany({
          where: { medicalRecord: { patientId } },
          orderBy: { createdAt: 'desc' }
        }),
        presentIllnesses: () => prisma.presentIllness.findMany({
          where: { medicalRecord: { patientId } },
          orderBy: { createdAt: 'desc' }
        }),
        pastConditions: () => prisma.pastMedicalCondition.findMany({
          where: { medicalRecord: { patientId } },
          orderBy: { createdAt: 'desc' }
        }),
        surgicalHistory: () => prisma.surgicalHistory.findMany({
          where: { medicalRecord: { patientId } },
          orderBy: { datePerformed: 'desc' }
        }),
        familyHistory: () => prisma.familyHistory.findMany({
          where: { medicalRecord: { patientId } },
          orderBy: { createdAt: 'desc' }
        }),
        medicationHistory: () => prisma.medicationHistory.findMany({
          where: { medicalRecord: { patientId } },
          orderBy: { createdAt: 'desc' }
        }),
        socialHistory: () => prisma.socialHistory.findMany({
          where: { medicalRecord: { patientId } },
          orderBy: { createdAt: 'desc' }
        }),
        reviewOfSystems: () => prisma.reviewOfSystems.findMany({
          where: { medicalRecord: { patientId } },
          orderBy: { createdAt: 'desc' }
        }),
        immunizations: () => prisma.immunization.findMany({
          where: { medicalRecord: { patientId } },
          orderBy: { dateGiven: 'desc' }
        }),
        travelHistory: () => prisma.travelHistory.findMany({
          where: { medicalRecord: { patientId } },
          orderBy: { dateFrom: 'desc' }
        })
      };

      if (queries[resource]) {
        const result = await queries[resource]();
        if (resource === 'patients') {
          return NextResponse.json(result.map(p => ({ ...p, name: `${p.firstName} ${p.lastName}` })));
        }
        if (resource === 'doctors') {
          return NextResponse.json(result.map(d => ({ ...d, name: `${d.firstName} ${d.lastName}` })));
        }
        return NextResponse.json(result);
      }
      return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
    }

    const medicalRecords = await prisma.medicalRecord.findMany({
      where: {
        patientId,
        ...(dateFrom && dateTo && {
          recordDate: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo)
          }
        })
      },
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
      },
      orderBy: { recordDate: 'desc' }
    });

    return NextResponse.json(medicalRecords.map(record => ({
      ...record,
      patient: record.patient ? { ...record.patient, name: `${record.patient.firstName} ${record.patient.lastName}` } : null,
      doctor: record.doctor ? { ...record.doctor, name: `${record.doctor.firstName} ${record.doctor.lastName}` } : null
    })));
  } catch (error) {
    console.error('Error in medical records API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const user = authenticate(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    const { resource, ...recordData } = data;

    const createOperations = {
      medicalRecord: () => prisma.medicalRecord.create({
        data: {
          patientId: recordData.patientId,
          doctorId: recordData.doctorId,
          recordDate: new Date(recordData.recordDate)
        },
        include: {
          patient: { select: { id: true, firstName: true, lastName: true } },
          doctor: { select: { id: true, firstName: true, lastName: true, department: { select: { name: true } } } }
        }
      }),
      allergy: () => prisma.allergy.create({ data: { medicalRecordId: recordData.medicalRecordId, name: recordData.name, severity: recordData.severity } }),
      diagnosis: () => prisma.diagnosis.create({ data: { medicalRecordId: recordData.medicalRecordId, code: recordData.code, description: recordData.description, diagnosedAt: new Date(recordData.diagnosedAt) } }),
      vitalSign: () => prisma.vitalSign.create({
        data: {
          medicalRecordId: recordData.medicalRecordId,
          bloodPressure: recordData.bloodPressure,
          heartRate: parseInt(recordData.heartRate),
          temperature: parseFloat(recordData.temperature),
          respiratoryRate: parseInt(recordData.respiratoryRate),
          oxygenSaturation: parseFloat(recordData.oxygenSaturation),
          recordedAt: new Date(recordData.recordedAt)
        }
      }),
      chiefComplaint: () => prisma.chiefComplaint.create({ data: { medicalRecordId: recordData.medicalRecordId, description: recordData.description, duration: recordData.duration, onset: recordData.onset } }),
      presentIllness: () => prisma.presentIllness.create({ data: { medicalRecordId: recordData.medicalRecordId, narrative: recordData.narrative, severity: recordData.severity, progress: recordData.progress, associatedSymptoms: recordData.associatedSymptoms } }),
      pastCondition: () => prisma.pastMedicalCondition.create({ data: { medicalRecordId: recordData.medicalRecordId, condition: recordData.condition, diagnosisDate: recordData.diagnosisDate ? new Date(recordData.diagnosisDate) : null, notes: recordData.notes } }),
      surgicalHistory: () => prisma.surgicalHistory.create({ data: { medicalRecordId: recordData.medicalRecordId, procedure: recordData.procedure, datePerformed: recordData.datePerformed ? new Date(recordData.datePerformed) : null, outcome: recordData.outcome, notes: recordData.notes } }),
      familyHistory: () => prisma.familyHistory.create({ data: { medicalRecordId: recordData.medicalRecordId, relative: recordData.relative, condition: recordData.condition, ageAtDiagnosis: parseInt(recordData.ageAtDiagnosis), notes: recordData.notes } }),
      medicationHistory: () => prisma.medicationHistory.create({
        data: {
          medicalRecordId: recordData.medicalRecordId,
          medicationName: recordData.medicationName,
          dosage: recordData.dosage,
          frequency: recordData.frequency,
          startDate: recordData.startDate ? new Date(recordData.startDate) : null,
          endDate: recordData.endDate ? new Date(recordData.endDate) : null,
          isCurrent: recordData.isCurrent
        }
      }),
      socialHistory: () => prisma.socialHistory.create({ data: { medicalRecordId: recordData.medicalRecordId, smokingStatus: recordData.smokingStatus, alcoholUse: recordData.alcoholUse, occupation: recordData.occupation, maritalStatus: recordData.maritalStatus, livingSituation: recordData.livingSituation } }),
      reviewOfSystems: () => prisma.reviewOfSystems.create({ data: { medicalRecordId: recordData.medicalRecordId, system: recordData.system, findings: recordData.findings } }),
      immunization: () => prisma.immunization.create({ data: { medicalRecordId: recordData.medicalRecordId, vaccine: recordData.vaccine, dateGiven: new Date(recordData.dateGiven), administeredBy: recordData.administeredBy, notes: recordData.notes } }),
      travelHistory: () => prisma.travelHistory.create({ data: { medicalRecordId: recordData.medicalRecordId, countryVisited: recordData.countryVisited, dateFrom: recordData.dateFrom ? new Date(recordData.dateFrom) : null, dateTo: recordData.dateTo ? new Date(recordData.dateTo) : null, purpose: recordData.purpose, travelNotes: recordData.travelNotes } })
    };

    if (createOperations[resource]) {
      const result = await createOperations[resource]();
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
    console.error('Error creating medical record:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}