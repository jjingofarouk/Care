import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const clinicalTasks = await prisma.clinicalTask.findMany({
    include: {
      patient: true,
    },
  });
  return NextResponse.json(clinicalTasks);
}

export async function POST(request) {
  const data = await request.json();
  const clinicalTask = await prisma.clinicalTask.create({
    data: {
      patientId: data.patientId,
      assignedToId: data.assignedToId,
      assignedToType: data.assignedToType,
      description: data.description,
      status: data.status,
    },
  });
  return NextResponse.json(clinicalTask);
}
