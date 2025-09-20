// app/api/discharge/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const discharge = await prisma.discharge.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });
    if (!discharge) {
      return NextResponse.json({ error: 'Discharge not found' }, { status: 404 });
    }
    return NextResponse.json(discharge);
  } catch (error) {
    console.error('GET /api/discharge/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch discharge', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const discharge = await prisma.discharge.update({
      where: { id: parseInt(params.id) },
      data: {
        patient: data.patientId ? { connect: { id: parseInt(data.patientId) } } : undefined,
        doctor: data.doctorId ? { connect: { id: parseInt(data.doctorId) } } : undefined,
        dischargeDate: data.dischargeDate ? new Date(data.dischargeDate) : undefined,
        dischargeNotes: data.dischargeNotes || null,
        followUpInstructions: data.followUpInstructions || null,
        medications: data.medications || null,
      },
      include: {
        patient: { include: { user: true } },
        doctor: { include: { user: true } },
      },
    });
    return NextResponse.json(discharge);
  } catch (error) {
    console.error('PUT /api/discharge/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update discharge', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const discharge = await prisma.discharge.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!discharge) {
      return NextResponse.json({ error: 'Discharge not found' }, { status: 404 });
    }
    await prisma.discharge.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Discharge deleted' });
  } catch (error) {
    console.error('DELETE /api/discharge/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete discharge', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}