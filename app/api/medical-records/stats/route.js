import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const where = {};
    if (patientId) {
      where.patientId = patientId;
    }
    if (dateFrom || dateTo) {
      where.recordDate = {};
      if (dateFrom) {
        where.recordDate.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.recordDate.lte = new Date(dateTo);
      }
    }

    const [totalRecords, totalAllergies, totalDiagnoses, totalPatients, totalChiefComplaints, totalMedications, totalImmunizations] =
      await Promise.all([
        prisma.medicalRecord.count({ where }),
        prisma.allergy.count({ where: { medicalRecord: where } }),
        prisma.diagnosis.count({ where: { medicalRecord: where } }),
        prisma.patient.count({
          where: { medicalRecords: { some: where } },
        }),
        prisma.chiefComplaint.count({ where: { medicalRecord: where } }),
        prisma.medicationHistory.count({ where: { medicalRecord: where } }),
        prisma.immunization.count({ where: { medicalRecord: where } }),
      ]);

    const stats = {
      totalRecords,
      totalAllergies,
      totalDiagnoses,
      averageRecordsPerPatient: totalPatients > 0 ? (totalRecords / totalPatients).toFixed(2) : 0,
      totalChiefComplaints,
      totalMedications,
      totalImmunizations,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('GET /api/medical-records/stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medical record stats', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}