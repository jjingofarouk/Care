import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const emergencies = await prisma.emergencyCase.findMany({
    include: {
      patient: true,
      triage: true,
      admission: true,
      logs: true,
    },
  });
  return NextResponse.json(emergencies);
}

export async function POST(request) {
  const data = await request.json();
  const emergency = await prisma.emergencyCase.create({
    data: {
      patientId: data.patientId,
      triageId: data.triageId,
      admissionId: data.admissionId,
    },
  });
  return NextResponse.json(emergency);
}