import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const log = await prisma.emergencyLog.findUnique({
    where: { id: params.id },
    include: { emergencyCase: true },
  });
  return log
    ? NextResponse.json(log)
    : NextResponse.json({ error: 'Emergency Log not found' }, { status: 404 });
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const log = await prisma.emergencyLog.update({
    where: { id: params.id },
    data: {
      emergencyCaseId: data.emergencyCaseId,
      description: data.description,
      loggedAt: new Date(data.loggedAt),
    },
  });
  return NextResponse.json(log);
}

export async function DELETE(request, { params }) {
  await prisma.emergencyLog.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ message: 'Emergency Log deleted' });
}