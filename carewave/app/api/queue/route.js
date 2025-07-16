import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const queueEntries = await prisma.queueEntry.findMany({
    include: {
      patient: true,
      serviceCounter: true,
      queueStatus: true,
    },
  });
  return NextResponse.json(queueEntries);
}

export async function POST(request) {
  const data = await request.json();
  const queueEntry = await prisma.queueEntry.create({
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
  return NextResponse.json(queueEntry, { status: 201 });
}
