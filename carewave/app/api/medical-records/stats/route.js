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
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');

  try {
    const where = {
      ...(patientId && { patientId }),
      ...(dateFrom && dateTo && {
        recordDate: {
          gte: new Date(dateFrom),
          lte: new Date(dateTo),
        },
      }),
    };

    const [
      totalRecords,
      totalAllergies,
      totalDiagnoses,
      totalVitalSigns,
      totalChiefComplaints,
      totalPresentIllnesses,
      totalPastConditions,
      totalSurgicalHistory,
      totalFamilyHistory,
      totalMedicationHistory,
      totalSocialHistory,
      totalReviewOfSystems,
      totalImmunizations,
      totalTravelHistory,
      patientCount
    ] = await Promise.all([
      prisma.medicalRecord.count({ where }),
      prisma.allergy.count({ where: { medicalRecord: where } }),
      prisma.diagnosis.count({ where: { medicalRecord: where } }),
      prisma.vitalSign.count({ where: { medicalRecord: where } }),
      prisma.chiefComplaint.count({ where: { medicalRecord: where } }),
      prisma.presentIllness.count({ where: { medicalRecord: where } }),
      prisma.pastMedicalCondition.count({ where: { medicalRecord: where } }),
      prisma.surgicalHistory.count({ where: { medicalRecord: where } }),
      prisma.familyHistory.count({ where: { medicalRecord: where } }),
      prisma.medicationHistory.count({ where: { medicalRecord: where } }),
      prisma.socialHistory.count({ where: { medicalRecord: where } }),
      prisma.reviewOfSystems.count({ where: { medicalRecord: where } }),
      prisma.immunization.count({ where: { medicalRecord: where } }),
      prisma.travelHistory.count({ where: { medicalRecord: where } }),
      prisma.patient.count()
    ]);

    return NextResponse.json({
      totalRecords,
      totalAllergies,
      totalDiagnoses,
      totalVitalSigns,
      totalChiefComplaints,
      totalPresentIllnesses,
      totalPastConditions,
      totalSurgicalHistory,
      totalFamilyHistory,
      totalMedicationHistory,
      totalSocialHistory,
      totalReviewOfSystems,
      totalImmunizations,
      totalTravelHistory,
      averageRecordsPerPatient: patientCount > 0 ? totalRecords / patientCount : 0
    });
  } catch (error) {
    console.error('Error fetching medical record stats:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}