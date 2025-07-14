import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');
  const drugId = searchParams.get('drugId');
  try {
    const prescriptions = await prisma.prescription.findMany({
      where: {
        ...(patientId && { patientId }),
        ...(drugId && { drugId }),
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        drug: true,
      },
    });
    return NextResponse.json(prescriptions);
  } catch (error) {
    console.error('GET /api/pharmacy error:', error);
    return NextResponse.json({ error: 'Failed to fetch prescriptions', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.patientId || !data.doctorId || !data.drugId || !data.dosage || !data.prescribedAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const prescription = await prisma.prescription.create({
      data: {
        patient: { connect: { id: data.patientId } },
        doctor: { connect: { id: data.doctorId } },
        drug: { connect: { id: data.drugId } },
        dosage: data.dosage,
        prescribedAt: new Date(data.prescribedAt),
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        drug: true,
      },
    });
    return NextResponse.json(prescription, { status: 201 });
  } catch (error) {
    console.error('POST /api/pharmacy error:', error);
    return NextResponse.json({ error: 'Failed to create prescription', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}