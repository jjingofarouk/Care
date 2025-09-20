// app/api/discharge/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const discharges = await prisma.discharge.findMany({
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });
    return NextResponse.json(discharges);
  } catch (error) {
    console.error('GET /api/discharge error:', error);
    return NextResponse.json({ error: 'Failed to fetch discharges', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.patientId || !data.doctorId || !data.dischargeDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const discharge = await prisma.discharge.create({
      data: {
        patient: { connect: { id: data.patientId } },
        doctor: { connect: { id: data.doctorId } },
        dischargeDate: new Date(data.dischargeDate),
        dischargeNotes: data.dischargeNotes || null,
        followUpInstructions: data.followUpInstructions || null,
        medications: data.medications || null,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });
    return NextResponse.json(discharge, { status: 201 });
  } catch (error) {
    console.error('POST /api/discharge error:', error);
    return NextResponse.json({ error: 'Failed to create discharge', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}