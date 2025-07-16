import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const progressNote = await prisma.progressNote.findUnique({
    where: { id: params.id },
    include: {
      patient: true,
      doctor: true,
    },
  });
  if (!progressNote) {
    return NextResponse.json({ error: 'Progress note not found' }, { status: 404 });
  }
  return NextResponse.json(progressNote);
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const progressNote = await prisma.progressNote.update({
    where: { id: params.id },
    data: {
      note: data.note,
    },
  });
  return NextResponse.json(progressNote);
}

export async function DELETE(request, { params }) {
  await prisma.progressNote.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ message: 'Progress note deleted' });
}
