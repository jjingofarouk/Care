import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const clinicalNote = await prisma.clinicalNote.findUnique({
    where: { id: params.id },
    include: {
      patient: true,
      doctor: true,
    },
  });
  if (!clinicalNote) {
    return NextResponse.json({ error: 'Clinical note not found' }, { status: 404 });
  }
  return NextResponse.json(clinicalNote);
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const clinicalNote = await prisma.clinicalNote.update({
    where: { id: params.id },
    data: {
      note: data.note,
    },
  });
  return NextResponse.json(clinicalNote);
}

export async function DELETE(request, { params }) {
  await prisma.clinicalNote.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ message: 'Clinical note deleted' });
}
