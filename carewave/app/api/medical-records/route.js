import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const medicalRecords = await prisma.medicalRecord.findMany({
      include: {
        patient: true,
      },
    });

    return NextResponse.json(medicalRecords);
  } catch (error) {
    console.error('GET /api/medical-records error:', error);
    return NextResponse.json({ error: 'Failed to fetch medical records', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.patientId || !data.recordId || !data.diagnosis || !data.date || !data.doctorName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingRecord = await prisma.medicalRecord.findUnique({
      where: { recordId: data.recordId },
    });
    if (existingRecord) {
      return NextResponse.json({ error: 'Record ID already exists' }, { status: 400 });
    }

    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        patientId: parseInt(data.patientId),
        recordId: data.recordId,
        diagnosis: data.diagnosis,
        presentingComplaint: data.presentingComplaint || null,
        familyHistory: data.familyHistory || null,
        socialHistory: data.socialHistory || null,
        pastMedicalHistory: data.pastMedicalHistory || null,
        allergies: data.allergies || null,
        medications: data.medications || null,
        date: new Date(data.date),
        doctorName: data.doctorName,
      },
    });

    return NextResponse.json(medicalRecord, { status: 201 });
  } catch (error) {
    console.error('POST /api/medical-records error:', error);
    return NextResponse.json({ error: 'Failed to create medical record', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}