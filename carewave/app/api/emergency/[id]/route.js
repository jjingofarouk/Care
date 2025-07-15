import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const emergency = await prisma.emergencyCase.findUnique({
    where: { id: params.id },
    include: {
      patient: true,
      triage: true,
      admission: true,
      logs: true,
    },
  });
  return emergency
    ? NextResponse.json(emergency)
    : NextResponse.json({ error: 'Emergency case not found' }, { status: 404 });
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const emergency = await prisma.emergencyCase.update({
    where: { id: params.id },
    data: {
      patientId: data.patientId,
      triageId: data.triageId,
      admissionId: data.admissionId,
    },
  });
  return NextResponse.json(emergency);
}

export async function DELETE(request, { params }) {
  await prisma.emergencyCase.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ message: 'Emergency case deleted' });
}