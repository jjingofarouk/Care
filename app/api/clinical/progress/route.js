import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const progressNotes = await prisma.progressNote.findMany({
    include: {
      patient: true,
      doctor: true,
    },
  });
  return NextResponse.json(progressNotes);
}

export async function POST(request) {
  const data = await request.json();
  const progressNote = await prisma.progressNote.create({
    data: {
      patientId: data.patientId,
      doctorId: data.doctorId,
      note: data.note,
    },
  });
  return NextResponse.json(progressNote);
}
