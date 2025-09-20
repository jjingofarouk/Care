import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const triage = await prisma.triage.findUnique({
    where: { id: params.id },
    include: { patient: true },
  });
  return triage
    ? NextResponse.json(triage)
    : NextResponse.json({ error: 'Triage not found' }, { status: 404 });
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const triage = await prisma.triage.update({
    where: { id: params.id },
    data: {
      patientId: data.patientId,
      triageLevel: data.triageLevel,
      symptoms: data.symptoms,
      assessedAt: new Date(data.assessedAt),
    },
  });
  return NextResponse.json(triage);
}

export async function DELETE(request, { params }) {
  await prisma.triage.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ message: 'Triage deleted' });
}