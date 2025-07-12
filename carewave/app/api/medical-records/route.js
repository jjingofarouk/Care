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
      switch (resource) {
        case 'allergies':
          const allergies = await prisma.allergy.findMany({
            where: { medicalRecord: { patientId } },
            orderBy: { createdAt: 'desc' }
          });
          return NextResponse.json(allergies);

        case 'diagnoses':
          const diagnoses = await prisma.diagnosis.findMany({
            where: { medicalRecord: { patientId } },
            orderBy: { diagnosedAt: 'desc' }
          });
          return NextResponse.json(diagnoses);

        case 'vitalSigns':
          const vitalSigns = await prisma.vitalSign.findMany({
            where: { medicalRecord: { patientId } },
            orderBy: { recordedAt: 'desc' }
          });
          return NextResponse.json(vitalSigns);

        case 'chiefComplaints':
          const chiefComplaints = await prisma.chiefComplaint.findMany({
            where: { medicalRecord: { patientId } },
            orderBy: { createdAt: 'desc' }
          });
          return NextResponse.json(chiefComplaints);

        case 'presentIllnesses':
          const presentIllnesses = await prisma.presentIllness.findMany({
            where: { medicalRecord: { patientId } },
            orderBy: { createdAt: 'desc' }
          });
          return NextResponse.json(presentIllnesses);

        case 'pastConditions':
          const pastConditions = await prisma.pastMedicalCondition.findMany({
            where: { medicalRecord: { patientId } },
            orderBy: { createdAt: 'desc' }
          });
          return NextResponse.json(pastConditions);

        case 'surgicalHistory':
          const surgicalHistory = await prisma.surgicalHistory.findMany({
            where: { medicalRecord: { patientId } },
            orderBy: { datePerformed: 'desc' }
          });
          return NextResponse.json(surgicalHistory);

        case 'familyHistory':
          const familyHistory = await prisma.familyHistory.findMany({
            where: { medicalRecord: { patientId } },
            orderBy: { createdAt: 'desc' }
          });
          return NextResponse.json(familyHistory);

        case 'medicationHistory':
          const medicationHistory = await prisma.medicationHistory.findMany({
            where: { medicalRecord: { patientId } },
            orderBy: { createdAt: 'desc' }
          });
          return NextResponse.json(medicationHistory);

        case 'socialHistory':
          const socialHistory = await prisma.socialHistory.findMany({
            where: { medicalRecord: { patientId } },
            orderBy: { createdAt: 'desc' }
          });
          return NextResponse.json(socialHistory);

        case 'reviewOfSystems':
          const reviewOfSystems = await prisma.reviewOfSystems.findMany({
            where: { medicalRecord: { patientId } },
            orderBy: { createdAt: 'desc' }
          });
          return NextResponse.json(reviewOfSystems);

        case 'immunizations':
          const immunizations = await prisma.immunization.findMany({
            where: { medicalRecord: { patientId } },
            orderBy: { dateGiven: 'desc' }
          });
          return NextResponse.json(immunizations);

        case 'travelHistory':
          const travelHistory = await prisma.travelHistory.findMany({
            where: { medicalRecord: { patientId } },
            orderBy: { dateFrom: 'desc' }
          });
          return NextResponse.json(travelHistory);

        default:
          return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
      }
    }

    const medicalRecords = await prisma.medicalRecord.findMany({
      where: {
        patientId,
        ...(dateFrom && dateTo && {
          recordDate: {
            gte: new Date(dateFrom),
            lte: new Date(dateTo),
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

    const transformedRecords = medicalRecords.map(record => ({
      ...record,
      patient: record.patient ? {
        ...record.patient,
        name: `${record.patient.firstName} ${record.patient.lastName}`
      } : null
    }));

    return NextResponse.json(transformedRecords);
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

    switch (resource) {
      case 'medicalRecord':
        const medicalRecord = await prisma.medicalRecord.create({
          data: {
            patientId: recordData.patientId,
            recordDate: new Date(recordData.recordDate),
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
        return NextResponse.json({
          ...medicalRecord,
          patient: {
            ...medicalRecord.patient,
            name: `${medicalRecord.patient.firstName} ${medicalRecord.patient.lastName}`
          }
        });

      case 'allergy':
        const allergy = await prisma.allergy.create({
          data: {
            medicalRecordId: recordData.medicalRecordId,
            name: recordData.name,
            severity: recordData.severity
          }
        });
        return NextResponse.json(allergy);

      case 'diagnosis':
        const diagnosis = await prisma.diagnosis.create({
          data: {
            medicalRecordId: recordData.medicalRecordId,
            code: recordData.code,
            description: recordData.description,
            diagnosedAt: new Date(recordData.diagnosedAt)
          }
        });
        return NextResponse.json(diagnosis);

      case 'vitalSign':
        const vitalSign = await prisma.vitalSign.create({
          data: {
            medicalRecordId: recordData.medicalRecordId,
            bloodPressure: recordData.bloodPressure,
            heartRate: recordData.heartRate,
            temperature: recordData.temperature,
            respiratoryRate: recordData.respiratoryRate,
            oxygenSaturation: recordData.oxygenSaturation,
            recordedAt: new Date(recordData.recordedAt)
          }
        });
        return NextResponse.json(vitalSign);

      case 'chiefComplaint':
        const chiefComplaint = await prisma.chiefComplaint.create({
          data: {
            medicalRecordId: recordData.medicalRecordId,
            description: recordData.description,
            duration: recordData.duration,
            onset: recordData.onset
          }
        });
        return NextResponse.json(chiefComplaint);

      case 'presentIllness':
        const presentIllness = await prisma.presentIllness.create({
          data: {
            medicalRecordId: recordData.medicalRecordId,
            narrative: recordData.narrative,
            severity: recordData.severity,
            progress: recordData.progress,
            associatedSymptoms: recordData.associatedSymptoms
          }
        });
        return NextResponse.json(presentIllness);

      case 'pastCondition':
        const pastCondition = await prisma.pastMedicalCondition.create({
          data: {
            medicalRecordId: recordData.medicalRecordId,
            condition: recordData.condition,
            diagnosisDate: recordData.diagnosisDate ? new Date(recordData.diagnosisDate) : null,
            notes: recordData.notes
          }
        });
        return NextResponse.json(pastCondition);

      case 'surgicalHistory':
        const surgicalHistory = await prisma.surgicalHistory.create({
          data: {
            medicalRecordId: recordData.medicalRecordId,
            procedure: recordData.procedure,
            datePerformed: recordData.datePerformed ? new Date(recordData.datePerformed) : null,
            outcome: recordData.outcome,
            notes: recordData.notes
          }
        });
        return NextResponse.json(surgicalHistory);

      case 'familyHistory':
        const familyHistory = await prisma.familyHistory.create({
          data: {
            medicalRecordId: recordData.medicalRecordId,
            relative: recordData.relative,
            condition: recordData.condition,
            ageAtDiagnosis: recordData.ageAtDiagnosis,
            notes: recordData.notes
          }
        });
        return NextResponse.json(familyHistory);

      case 'medicationHistory':
        const medicationHistory = await prisma.medicationHistory.create({
          data: {
            medicalRecordId: recordData.medicalRecordId,
            medicationName: recordData.medicationName,
            dosage: recordData.dosage,
            frequency: recordData.frequency,
            startDate: recordData.startDate ? new Date(recordData.startDate) : null,
            endDate: recordData.endDate ? new Date(recordData.endDate) : null,
            isCurrent: recordData.isCurrent
          }
        });
        return NextResponse.json(medicationHistory);

      case 'socialHistory':
        const socialHistory = await prisma.socialHistory.create({
          data: {
            medicalRecordId: recordData.medicalRecordId,
            smokingStatus: recordData.smokingStatus,
            alcoholUse: recordData.alcoholUse,
            occupation: recordData.occupation,
            maritalStatus: recordData.maritalStatus,
            livingSituation: recordData.livingSituation
          }
        });
        return NextResponse.json(socialHistory);

      case 'reviewOfSystems':
        const reviewOfSystems = await prisma.reviewOfSystems.create({
          data: {
            medicalRecordId: recordData.medicalRecordId,
            system: recordData.system,
            findings: recordData.findings
          }
        });
        return NextResponse.json(reviewOfSystems);

      case 'immunization':
        const immunization = await prisma.immunization.create({
          data: {
            medicalRecordId: recordData.medicalRecordId,
            vaccine: recordData.vaccine,
            dateGiven: new Date(recordData.dateGiven),
            administeredBy: recordData.administeredBy,
            notes: recordData.notes
          }
        });
        return NextResponse.json(immunization);

      case 'travelHistory':
        const travelHistory = await prisma.travelHistory.create({
          data: {
            medicalRecordId: recordData.medicalRecordId,
            countryVisited: recordData.countryVisited,
            dateFrom: recordData.dateFrom ? new Date(recordData.dateFrom) : null,
            dateTo: recordData.dateTo ? new Date(recordData.dateTo) : null,
            purpose: recordData.purpose,
            travelNotes: recordData.travelNotes
          }
        });
        return NextResponse.json(travelHistory);

      default:
        return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating medical record:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}