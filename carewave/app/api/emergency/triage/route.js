import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const triages = await prisma.triage.findMany({
    include: { patient: true },
  });
  return NextResponse.json(triages);
}

export async function POST(request) {
  const data = await request.json();
  const triage = await prisma.triage.create({
    data: {
      patientId: data.patientId,
      triageLevel: data.triageLevel,
      symptoms: data.symptoms,
      assessedAt: new Date(data.assessedAt),
    },
  });
  return NextResponse.json(triage);
}