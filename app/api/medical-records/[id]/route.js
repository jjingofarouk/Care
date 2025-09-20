import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const include = new URL(request.url).searchParams.get('include');

    const includeObj = {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    };
    if (include) {
      const includeFields = include.split(',');
      includeFields.forEach((field) => {
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

    const medicalRecord = await prisma.medicalRecord.findUnique({
      where: { id },
      include: includeObj,
    });

    if (!medicalRecord) {
      return NextResponse.json(
        { error: 'Medical record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(medicalRecord);
  } catch (error) {
    console.error(`GET /api/medical-records/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch medical record', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    if (!data.patientId || !data.recordDate) {
      return NextResponse.json(
        { error: 'Patient ID and record date are required' },
        { status: 400 }
      );
    }

    const recordDate = new Date(data.recordDate);
    if (isNaN(recordDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format for recordDate' },
        { status: 400 }
      );
    }

    // Validate related data
    if (data.chiefComplaint && (!data.chiefComplaint.description || !data.chiefComplaint.duration)) {
      return NextResponse.json(
        { error: 'Chief complaint requires description and duration' },
        { status: 400 }
      );
    }

    const medicalRecord = await prisma.medicalRecord.update({
      where: { id },
      data: {
        patientId: data.patientId,
        recordDate,
        chiefComplaint: {
          upsert: {
            create: {
              description: data.chiefComplaint?.description || '',
              duration: data.chiefComplaint?.duration || '',
              onset: data.chiefComplaint?.onset || null,
            },
            update: {
              description: data.chiefComplaint?.description || '',
              duration: data.chiefComplaint?.duration || '',
              onset: data.chiefComplaint?.onset || null,
            },
          },
        },
        presentIllness: {
          upsert: {
            create: {
              narrative: data.presentIllness?.narrative || '',
              severity: data.presentIllness?.severity || null,
              progress: data.presentIllness?.progress || null,
              associatedSymptoms: data.presentIllness?.associatedSymptoms || null,
            },
            update: {
              narrative: data.presentIllness?.narrative || '',
              severity: data.presentIllness?.severity || null,
              progress: data.presentIllness?.progress || null,
              associatedSymptoms: data.presentIllness?.associatedSymptoms || null,
            },
          },
        },
        pastConditions: {
          deleteMany: {},
          create: data.pastConditions?.map((condition) => ({
            condition: condition.condition || '',
            diagnosisDate: condition.diagnosisDate ? new Date(condition.diagnosisDate) : null,
            notes: condition.notes || null,
          })) || [],
        },
        surgicalHistory: {
          deleteMany: {},
          create: data.surgicalHistory?.map((surgery) => ({
            procedure: surgery.procedure || '',
            datePerformed: surgery.datePerformed ? new Date(surgery.datePerformed) : null,
            outcome: surgery.outcome || null,
            notes: surgery.notes || null,
          })) || [],
        },
        familyHistory: {
          deleteMany: {},
          create: data.familyHistory?.map((family) => ({
            relative: family.relative || '',
            condition: family.condition || '',
            ageAtDiagnosis: family.ageAtDiagnosis ? parseInt(family.ageAtDiagnosis, 10) : null,
            notes: family.notes || null,
          })) || [],
        },
        medicationHistory: {
          deleteMany: {},
          create: data.medicationHistory?.map((medication) => ({
            medicationName: medication.medicationName || '',
            dosage: medication.dosage || '',
            frequency: medication.frequency || '',
            startDate: medication.startDate ? new Date(medication.startDate) : null,
            endDate: medication.endDate ? new Date(medication.endDate) : null,
            isCurrent: medication.isCurrent || false,
          })) || [],
        },
        socialHistory: {
          upsert: {
            create: {
              smokingStatus: data.socialHistory?.smokingStatus || null,
              alcoholUse: data.socialHistory?.alcoholUse || null,
              occupation: data.socialHistory?.occupation || null,
              maritalStatus: data.socialHistory?.maritalStatus || null,
              livingSituation: data.socialHistory?.livingSituation || null,
            },
            update: {
              smokingStatus: data.socialHistory?.smokingStatus || null,
              alcoholUse: data.socialHistory?.alcoholUse || null,
              occupation: data.socialHistory?.occupation || null,
              maritalStatus: data.socialHistory?.maritalStatus || null,
              livingSituation: data.socialHistory?.livingSituation || null,
            },
          },
        },
        reviewOfSystems: {
          deleteMany: {},
          create: data.reviewOfSystems?.map((review) => ({
            system: review.system || '',
            findings: review.findings || '',
          })) || [],
        },
        immunizations: {
          deleteMany: {},
          create: data.immunizations?.map((immunization) => ({
            vaccine: immunization.vaccine || '',
            dateGiven: new Date(immunization.dateGiven),
            administeredBy: immunization.administeredBy || null,
            notes: immunization.notes || null,
          })) || [],
        },
        travelHistory: {
          deleteMany: {},
          create: data.travelHistory?.map((travel) => ({
            countryVisited: travel.countryVisited || '',
            dateFrom: travel.dateFrom ? new Date(travel.dateFrom) : null,
            dateTo: travel.dateTo ? new Date(travel.dateTo) : null,
            purpose: travel.purpose || null,
            travelNotes: travel.travelNotes || null,
          })) || [],
        },
        allergies: {
          deleteMany: {},
          create: data.allergies?.map((allergy) => ({
            name: allergy.name || '',
            severity: allergy.severity || '',
          })) || [],
        },
        diagnoses: {
          deleteMany: {},
          create: data.diagnoses?.map((diagnosis) => ({
            code: diagnosis.code || '',
            description: diagnosis.description || '',
            diagnosedAt: new Date(diagnosis.diagnosedAt),
          })) || [],
        },
        vitalSigns: {
          deleteMany: {},
          create: data.vitalSigns?.map((vital) => ({
            bloodPressure: vital.bloodPressure || null,
            heartRate: vital.heartRate ? parseInt(vital.heartRate, 10) : null,
            temperature: vital.temperature ? parseFloat(vital.temperature) : null,
            respiratoryRate: vital.respiratoryRate ? parseInt(vital.respiratoryRate, 10) : null,
            oxygenSaturation: vital.oxygenSaturation ? parseFloat(vital.oxygenSaturation) : null,
            recordedAt: new Date(vital.recordedAt),
          })) || [],
        },
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
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

    return NextResponse.json(medicalRecord);
  } catch (error) {
    console.error(`PUT /api/medical-records/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to update medical record', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.medicalRecord.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    console.error(`DELETE /api/medical-records/${params.id} error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete medical record', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}