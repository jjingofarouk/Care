// app/api/vaccination/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const vaccination = await prisma.vaccinationRecord.findUnique({
      where: { id: params.id },
      include: { patient: true, vaccine: true, immunizationSchedule: true },
    });
    if (!vaccination) {
      return NextResponse.json({ error: 'Vaccination not found' }, { status: 404 });
    }
    return NextResponse.json(vaccination);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching vaccination' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const vaccination = await prisma.vaccinationRecord.update({
      where: { id: params.id },
      data: {
        patientId: data.patientId,
        vaccineId: data.vaccineId,
        immunizationScheduleId: data.immunizationScheduleId,
        administeredDate: new Date(data.administeredDate),
      },
    });
    return NextResponse.json(vaccination);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating vaccination' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.vaccinationRecord.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Vaccination deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting vaccination' }, { status: 500 });
  }
}
