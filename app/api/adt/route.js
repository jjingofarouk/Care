// app/api/adt/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const admissions = await prisma.admission.findMany({
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        ward: true,
      },
    });
    return NextResponse.json(admissions);
  } catch (error) {
    console.error('GET /api/adt error:', error);
    return NextResponse.json({ error: 'Failed to fetch admissions', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.patientId || !data.admissionDate || !data.status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const admission = await prisma.admission.create({
      data: {
        patient: { connect: { id: data.patientId } },
        doctor: data.doctorId ? { connect: { id: data.doctorId } } : undefined,
        ward: data.wardId ? { connect: { id: data.wardId } } : undefined,
        admissionDate: new Date(data.admissionDate),
        triagePriority: data.triagePriority || null,
        triageNotes: data.triageNotes || null,
        presentingComplaints: data.presentingComplaints || null,
        relayedInfo: data.relayedInfo || null,
        status: data.status,
        dischargeNotes: data.dischargeNotes || null,
        dischargeDate: data.dischargeDate ? new Date(data.dischargeDate) : null,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
        preAdmissionNotes: data.preAdmissionNotes || null,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
        ward: true,
      },
    });
    if (data.wardId) {
      await prisma.ward.update({
        where: { id: data.wardId },
        data: { occupiedBeds: { increment: 1 } },
      });
    }
    return NextResponse.json(admission, { status: 201 });
  } catch (error) {
    console.error('POST /api/adt error:', error);
    return NextResponse.json({ error: 'Failed to create admission', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}