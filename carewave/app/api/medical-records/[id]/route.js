import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid medical record ID' }, { status: 400 });
    }

    const medicalRecord = await prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: true,
      },
    });

    if (!medicalRecord) {
      return NextResponse.json({ error: 'Medical record not found' }, { status: 404 });
    }

    return NextResponse.json(medicalRecord);
  } catch (error) {
    console.error('GET /api/medical-records/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch medical record', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid medical record ID' }, { status: 400 });
    }

    const data = await request.json();
    if (!data.patientId || !data.recordId || !data.diagnosis || !data.date || !data.doctorName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const medicalRecord = await prisma.medicalRecord.update({
      where: { id },
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

    return NextResponse.json(medicalRecord);
  } catch (error) {
    console.error('PUT /api/medical-records/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update medical record', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid medical record ID' }, { status: 400 });
    }

    await prisma.medicalRecord.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Medical record deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/medical-records/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete medical record', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}