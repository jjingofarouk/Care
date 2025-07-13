import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const patientId = searchParams.get('patientId');
    const include = searchParams.get('include');

    const where = {};
    if (search) {
      where.OR = [
        { patient: { firstName: { contains: search, mode: 'insensitive' } } },
        { patient: { lastName: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (patientId) {
      where.patientId = patientId;
    }

    const includeObj = {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        }
      }
    };
    if (include) {
      const includeFields = include.split(',');
      includeFields.forEach(field => {
        switch (field.trim()) {
          case 'chiefComplaint':
            includeObj.chiefComplaint = true;
            break;
          case 'presentIllness':
            includeObj.presentIllness = true;
            break;
          case 'pastConditions':
            includeObj.pastConditions = true;
            break;
          case 'surgicalHistory':
            includeObj.surgicalHistory = true;
            break;
          case 'familyHistory':
            includeObj.familyHistory = true;
            break;
          case 'medicationHistory':
            includeObj.medicationHistory = true;
            break;
          case 'socialHistory':
            includeObj.socialHistory = true;
            break;
          case 'reviewOfSystems':
            includeObj.reviewOfSystems = true;
            break;
          case 'immunizations':
            includeObj.immunizations = true;
            break;
          case 'travelHistory':
            includeObj.travelHistory = true;
            break;
          case 'allergies':
            includeObj.allergies = true;
            break;
          case 'diagnoses':
            includeObj.diagnoses = true;
            break;
          case 'vitalSigns':
            includeObj.vitalSigns = true;
            break;
        }
      });
    }

    const medicalRecords = await prisma.medicalRecord.findMany({
      where,
      include: includeObj,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(medicalRecords);
  } catch (error) {
    console.error('GET /api/medical-records error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medical records', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.patientId || !data.recordDate) {
      return NextResponse.json(
        { error: 'Patient ID and record date are required' },
        { status: 400 }
      );
    }

    const id = `MR-${uuidv4().slice(0, 8)}`;
    const recordDate = new Date(data.recordDate);
    if (isNaN(recordDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format for recordDate' },
        { status: 400 }
      );
    }

    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        id,
        patientId: data.patientId,
        recordDate,
        chiefComplaint: data.chiefComplaint ? {
          create: {
            description: data.chiefComplaint.description || '',
            duration: data.chiefComplaint.duration || '',
            onset: data.chiefComplaint.onset || null,
          }
        } : undefined,
        presentIllness: data.presentIllness ? {
          create: {
            narrative: data.presentIllness.narrative || '',
            severity: data.presentIllness.severity || null,
            progress: data.presentIllness.progress || null,
            associatedSymptoms: data.presentIllness.associatedSymptoms || null,
          }
        } : undefined,
        pastConditions: data.pastConditions ? {
          create: data.pastConditions.map(condition => ({
            condition: condition.condition || '',
            diagnosisDate: condition.diagnosisDate ? new Date(condition.diagnosisDate) : null,
            notes: condition.notes || null,
          }))
        } : undefined,
        surgicalHistory: data.surgicalHistory ? {
          create: data.surgicalHistory.map(surgery => ({
            procedure: surgery.procedure || '',
            datePerformed: surgery.datePerformed ? new Date(surgery.datePerformed) : null,
            outcome: surgery.outcome || null,
            notes: surgery.notes || null,
          }))
        } : undefined,
        familyHistory: data.familyHistory ? {
          create: data.familyHistory.map(family => ({
            relative: family.relative || '',
            condition: family.condition || '',
            ageAtDiagnosis: family.ageAtDiagnosis || null,
            notes: family.notes || null,
          }))
        } : undefined,
        medicationHistory: data.medicationHistory ? {
          create: data.medicationHistory.map(medication => ({
            medicationName: medication.medicationName || '',
            dosage: medication.dosage || '',
            frequency: medication.frequency || '',
            startDate: medication.startDate ? new Date(medication.startDate) : null,
            endDate: medication.endDate ? new Date(medication.endDate) : null,
            isCurrent: medication.isCurrent || false,
          }))
        } : undefined,
        socialHistory: data.socialHistory ? {
          create: {
            smokingStatus: data.socialHistory.smokingStatus || null,
            alcoholUse: data.socialHistory.alcoholUse || null,
            occupation: data.socialHistory.occupation || null,
            maritalStatus: data.socialHistory.maritalStatus || null,
            livingSituation: data.socialHistory.livingSituation || null,
          }
        } : undefined,
        reviewOfSystems: data.reviewOfSystems ? {
          create: data.reviewOfSystems.map(review => ({
            system: review.system || '',
            findings: review.findings || '',
          }))
        } : undefined,
        immunizations: data.immunizations ? {
          create: data.immunizations.map(immunization => ({
            vaccine: immunization.vaccine || '',
            dateGiven: new Date(immunization.dateGiven),
            administeredBy: immunization.administeredBy || null,
            notes: immunization.notes || null,
          }))
        } : undefined,
        travelHistory: data.travelHistory ? {
          create: data.travelHistory.map(travel => ({
            countryVisited: travel.countryVisited || '',
            dateFrom: travel.dateFrom ? new Date(travel.dateFrom) : null,
            dateTo: travel.dateTo ? new Date(travel.dateTo) : null,
            purpose: travel.purpose || null,
            travelNotes: travel.travelNotes || null,
          }))
        } : undefined,
        allergies: data.allergies ? {
          create: data.allergies.map(allergy => ({
            name: allergy.name || '',
            severity: allergy.severity || '',
          }))
        } : undefined,
        diagnoses: data.diagnoses ? {
          create: data.diagnoses.map(diagnosis => ({
            code: diagnosis.code || '',
            description: diagnosis.description || '',
            diagnosedAt: new Date(diagnosis.diagnosedAt),
          }))
        } : undefined,
        vitalSigns: data.vitalSigns ? {
          create: data.vitalSigns.map(vital => ({
            bloodPressure: vital.bloodPressure || null,
            heartRate: vital.heartRate || null,
            temperature: vital.temperature || null,
            respiratoryRate: vital.respiratoryRate || null,
            oxygenSaturation: vital.oxygenSaturation || null,
            recordedAt: new Date(vital.recordedAt),
          }))
        } : undefined,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        },
        chiefComplaint: true,
        presentIllness: true,
        pastConditions: true,
        surgicalHistory: true,
        familyHistory: true,
        medicationHistory: true,
        socialHistory: true,
        reviewOfSystems: true,
        immunizations: true,
        travelHistory: true,
        allergies: true,
        diagnoses: true,
        vitalSigns: true,
      },
    });

    return NextResponse.json(medicalRecord, { status: 201 });
  } catch (error) {
    console.error('POST /api/medical-records error:', error);
    return NextResponse.json(
      { error: 'Failed to create medical record', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}