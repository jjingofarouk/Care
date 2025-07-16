// app/api/vaccination/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const vaccinations = await prisma.vaccinationRecord.findMany({
      include: { patient: true, vaccine: true, immunizationSchedule: true },
    });
    return NextResponse.json(vaccinations);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching vaccinations' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const vaccination = await prisma.vaccinationRecord.create({
      data: {
        id: data.id,
        patientId: data.patientId,
        vaccineId: data.vaccineId,
        immunizationScheduleId: data.immunizationScheduleId,
        administeredDate: new Date(data.administeredDate),
      },
    });
    return NextResponse.json(vaccination);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating vaccination' }, { status: 500 });
  }
}
