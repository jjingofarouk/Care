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
      switch (resource) {
        case 'allergy':
          const allergy = await prisma.allergy.findUnique({
            where: { id }
          });
          if (!allergy) return NextResponse.json({ error: 'Allergy not found' }, { status: 404 });
          return NextResponse.json(allergy);

        case 'diagnosis':
          const diagnosis = await prisma.diagnosis.findUnique({
            where: { id }
          });
          if (!diagnosis) return NextResponse.json({ error: 'Diagnosis not found' }, { status: 404 });
          return NextResponse.json(diagnosis);

        case 'vitalSign':
          const vitalSign = await prisma.vitalSign.findUnique({
            where: { id }
          });
          if (!vitalSign) return NextResponse.json({ error: 'Vital sign not found' }, { status: 404 });
          return NextResponse.json(vitalSign);

        case 'chiefComplaint':
          const chiefComplaint = await prisma.chiefComplaint.findUnique({
            where: { id }
          });
          if (!chiefComplaint) return NextResponse.json({ error: 'Chief complaint not found' }, { status: 404 });
          return NextResponse.json(chiefComplaint);

        case 'presentIllness':
          const presentIllness = await prisma.presentIllness.findUnique({
            where: { id }
          });
          if (!presentIllness) return NextResponse.json({ error: 'Present illness not found' }, { status: 404 });
          return NextResponse.json(presentIllness);

        case 'pastCondition':
          const pastCondition = await prisma.pastMedicalCondition.findUnique({
            where: { id }
          });
          if (!pastCondition) return NextResponse.json({ error: 'Past condition not found' }, { status: 404 });
          return NextResponse.json(pastCondition);

        case 'surgicalHistory':
          const surgicalHistory = await prisma.surgicalHistory.findUnique({
            where: { id }
          });
          if (!surgicalHistory) return NextResponse.json({ error: 'Surgical history not found' }, { status: 404 });
          return NextResponse.json(surgicalHistory);

        case 'familyHistory':
          const familyHistory = await prisma.familyHistory.findUnique({
            where: { id }
          });
          if (!familyHistory) return NextResponse.json({ error: 'Family history not found' }, { status: 404 });
          return NextResponse.json(familyHistory);

        case 'medicationHistory':
          const medicationHistory = await prisma.medicationHistory.findUnique({
            where: { id }
          });
          if (!medicationHistory) return NextResponse.json({ error: 'Medication history not found' }, { status: 404 });
          return NextResponse.json(medicationHistory);

        case 'socialHistory':
          const socialHistory = await prisma.socialHistory.findUnique({
            where: { id }
          });
          if (!socialHistory) return NextResponse.json({ error: 'Social history not found' }, { status: 404 });
          return NextResponse.json(socialHistory);

        case 'reviewOfSystems':
          const reviewOfSystems = await prisma.reviewOfSystems.findUnique({
            where: { id }
          });
          if (!reviewOfSystems) return NextResponse.json({ error: 'Review of systems not found' }, { status: 404 });
          return NextResponse.json(reviewOfSystems);

        case 'immunization':
          const immunization = await prisma.immunization.findUnique({
            where: { id }
          });
          if (!immunization) return NextResponse.json({ error: 'Immunization not found' }, { status: 404 });
          return NextResponse.json(immunization);

        case 'travelHistory':
          const travelHistory = await prisma.travelHistory.findUnique({
            where: { id }
          });
          if (!travelHistory) return NextResponse.json({ error: 'Travel history not found' }, { status: 404 });
          return NextResponse.json(travelHistory);

        default:
          return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
      }
    }

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
      return NextResponse.json({ error: 'Medical record not found' }, { status: 404 });
    }

    const transformedRecord = {
      ...medicalRecord,
      patient: medicalRecord.patient ? {
        ...medicalRecord.patient,
        name: `${medicalRecord.patient.firstName} ${medicalRecord.patient.lastName}`
      } : null
    };

    return NextResponse.json(transformedRecord);
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

    switch (resource) {
      case 'medicalRecord':
        const medicalRecord = await prisma.medicalRecord.update({
          where: { id },
          data: {
            recordDate: new Date(updateData.recordDate)
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
        const allergy = await prisma.allergy.update({
          where: { id },
          data: {
            name: updateData.name,
            severity: updateData.severity
          }
        });
        return NextResponse.json(allergy);

      case 'diagnosis':
        const diagnosis = await prisma.diagnosis.update({
          where: { id },
          data: {
            code: updateData.code,
            description: updateData.description,
            diagnosedAt: new Date(updateData.diagnosedAt)
          }
        });
        return NextResponse.json(diagnosis);

      case 'vitalSign':
        const vitalSign = await prisma.vitalSign.update({
          where: { id },
          data: {
            bloodPressure: updateData.bloodPressure,
            heartRate: updateData.heartRate,
            temperature: updateData.temperature,
            respiratoryRate: updateData.respiratoryRate,
            oxygenSaturation: updateData.oxygenSaturation,
            recordedAt: new Date(updateData.recordedAt)
          }
        });
        return NextResponse.json(vitalSign);

      case 'chiefComplaint':
        const chiefComplaint = await prisma.chiefComplaint.update({
          where: { id },
          data: {
            description: updateData.description,
            duration: updateData.duration,
            onset: updateData.onset
          }
        });
        return NextResponse.json(chiefComplaint);

      case 'presentIllness':
        const presentIllness = await prisma.presentIllness.update({
          where: { id },
          data: {
            narrative: updateData.narrative,
            severity: updateData.severity,
            progress: updateData.progress,
            associatedSymptoms: updateData.associatedSymptoms
          }
        });
        return NextResponse.json(presentIllness);

      case 'pastCondition':
        const pastCondition = await prisma.pastMedicalCondition.update({
          where: { id },
          data: {
            condition: updateData.condition,
            diagnosisDate: updateData.diagnosisDate ? new Date(updateData.diagnosisDate) : null,
            notes: updateData.notes
          }
        });
        return NextResponse.json(pastCondition);

      case 'surgicalHistory':
        const surgicalHistory = await prisma.surgicalHistory.update({
          where: { id },
          data: {
            procedure: updateData.procedure,
            datePerformed: updateData.datePerformed ? new Date(updateData.datePerformed) : null,
            outcome: updateData.outcome,
            notes: updateData.notes
          }
        });
        return NextResponse.json(surgicalHistory);

      case 'familyHistory':
        const familyHistory = await prisma.familyHistory.update({
          where: { id },
          data: {
            relative: updateData.relative,
            condition: updateData.condition,
            ageAtDiagnosis: updateData.ageAtDiagnosis,
            notes: updateData.notes
          }
        });
        return NextResponse.json(familyHistory);

      case 'medicationHistory':
        const medicationHistory = await prisma.medicationHistory.update({
          where: { id },
          data: {
            medicationName: updateData.medicationName,
            dosage: updateData.dosage,
            frequency: updateData.frequency,
            startDate: updateData.startDate ? new Date(updateData.startDate) : null,
            endDate: updateData.endDate ? new Date(updateData.endDate) : null,
            isCurrent: updateData.isCurrent
          }
        });
        return NextResponse.json(medicationHistory);

      case 'socialHistory':
        const socialHistory = await prisma.socialHistory.update({
          where: { id },
          data: {
            smokingStatus: updateData.smokingStatus,
            alcoholUse: updateData.alcoholUse,
            occupation: updateData.occupation,
            maritalStatus: updateData.maritalStatus,
            livingSituation: updateData.livingSituation
          }
        });
        return NextResponse.json(socialHistory);

      case 'reviewOfSystems':
        const reviewOfSystems = await prisma.reviewOfSystems.update({
          where: { id },
          data: {
            system: updateData.system,
            findings: updateData.findings
          }
        });
        return NextResponse.json(reviewOfSystems);

      case 'immunization':
        const immunization = await prisma.immunization.update({
          where: { id },
          data: {
            vaccine: updateData.vaccine,
            dateGiven: new Date(updateData.dateGiven),
            administeredBy: updateData.administeredBy,
            notes: updateData.notes
          }
        });
        return NextResponse.json(immunization);

      case 'travelHistory':
        const travelHistory = await prisma.travelHistory.update({
          where: { id },
          data: {
            countryVisited: updateData.countryVisited,
            dateFrom: updateData.dateFrom ? new Date(updateData.dateFrom) : null,
            dateTo: updateData.dateTo ? new Date(updateData.dateTo) : null,
            purpose: updateData.purpose,
            travelNotes: updateData.travelNotes
          }
        });
        return NextResponse.json(travelHistory);

      default:
        return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
    }
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
      await prisma.medicalRecord.delete({
        where: { id }
      });
      return NextResponse.json({ message: 'Medical record deleted' });
    }

    switch (resource) {
      case 'allergy':
        await prisma.allergy.delete({
          where: { id }
        });
        return NextResponse.json({ message: 'Allergy deleted' });

      case 'diagnosis':
        await prisma.diagnosis.delete({
          where: { id }
        });
        return NextResponse.json({ message: 'Diagnosis deleted' });

      case 'vitalSign':
        await prisma.vitalSign.delete({
          where: { id }
        });
        return NextResponse.json({ message: 'Vital sign deleted' });

      case 'chiefComplaint':
        await prisma.chiefComplaint.delete({
          where: { id }
       

 });
        return NextResponse.json({ message: 'Chief complaint deleted' });

      case 'presentIllness':
        await prisma.presentIllness.delete({
          where: { id }
        });
        return NextResponse.json({ message: 'Present illness deleted' });

      case 'pastCondition':
        await prisma.pastMedicalCondition.delete({
          where: { id }
        });
        return NextResponse.json({ message: 'Past condition deleted' });

      case 'surgicalHistory':
        await prisma.surgicalHistory.delete({
          where: { id }
        });
        return NextResponse.json({ message: 'Surgical history deleted' });

      case 'familyHistory':
        await prisma.familyHistory.delete({
          where: id }
        });
        return NextResponse.json({ message: 'Family history deleted' });

      case 'medicationHistory':
        await prisma.medicationHistory.delete({
          where: { id }
        });
        return NextResponse.json({ message: 'Medication history deleted' });

      case 'socialHistory':
        await prisma.socialHistory.delete({
          where: { id }
        });
        return NextResponse.json({ message: 'Social history deleted' });

      case 'reviewOfSystems':
        await prisma.reviewOfSystems.delete({
          where: { id }
        });
        return NextResponse.json({ message: 'Review of systems deleted' });

      case 'immunization':
        await prisma.immunization.delete({
          where: { id }
        });
        return NextResponse.json({ message: 'Immunization deleted' });

      case 'travelHistory':
        await prisma.travelHistory.delete({
          where: { id }
        });
        return NextResponse.json({ message: 'Travel history deleted' });

      default:
        return NextResponse.json({ error: 'Invalid resource' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error deleting medical record:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}