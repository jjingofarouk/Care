import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const soapNote = await prisma.sOAPNote.findUnique({
    where: { id: params.id },
    include: {
      patient: true,
      doctor: true,
    },
  });
  if (!soapNote) {
    return NextResponse.json({ error: 'SOAP note not found' }, { status: 404 });
  }
  return NextResponse.json(soapNote);
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const soapNote = await prisma.sOAPNote.update({
    where: { id: params.id },
    data: {
      subjective: data.subjective,
      objective: data.objective,
      assessment: data.assessment,
      plan: data.plan,
    },
  });
  return NextResponse.json(soapNote);
}

export async function DELETE(request, { params }) {
  await prisma.sOAPNote.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ message: 'SOAP note deleted' });
}
