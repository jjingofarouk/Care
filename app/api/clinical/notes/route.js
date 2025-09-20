import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const clinicalNotes = await prisma.clinicalNote.findMany({
    include: {
      patient: true,
      doctor: true,
    },
  });
  return NextResponse.json(clinicalNotes);
}

export async function POST(request) {
  const data = await request.json();
  const clinicalNote = await prisma.clinicalNote.create({
    data: {
      patientId: data.patientId,
      doctorId: data.doctorId,
      note: data.note,
    },
  });
  return NextResponse.json(clinicalNote);
}
