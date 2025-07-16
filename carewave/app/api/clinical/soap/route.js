import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const soapNotes = await prisma.sOAPNote.findMany({
    include: {
      patient: true,
      doctor: true,
    },
  });
  return NextResponse.json(soapNotes);
}

export async function POST(request) {
  const data = await request.json();
  const soapNote = await prisma.sOAPNote.create({
    data: {
      patientId: data.patientId,
      doctorId: data.doctorId,
      subjective: data.subjective,
      objective: data.objective,
      assessment: data.assessment,
      plan: data.plan,
    },
  });
  return NextResponse.json(soapNote);
}
