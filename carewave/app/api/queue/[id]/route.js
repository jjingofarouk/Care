import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const queueEntry = await prisma.queueEntry.findUnique({
    where: { id: params.id },
    include: {
      patient: true,
      serviceCounter: true,
      queueStatus: true,
    },
  });
  if (!queueEntry) {
    return NextResponse.json({ error: 'Queue entry not found' }, { status: 404 });
  }
  return NextResponse.json(queueEntry);
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const queueEntry = await prisma.queueEntry.update({
    where: { id: params.id },
    data: {
      patientId: data.patientId,
      serviceCounterId: data.serviceCounterId,
      queueStatusId: data.queueStatusId,
      queueNumber: data.queueNumber,
    },
    include: {
      patient: true,
      serviceCounter: true,
      queueStatus: true,
    },
  });
  return NextResponse.json(queueEntry);
}

export async function DELETE(request, { params }) {
  await prisma.queueEntry.delete({
    where: { id: params.id },
  });
  return NextResponse.json({}, { status: 204 });
}
