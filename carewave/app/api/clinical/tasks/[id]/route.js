import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const clinicalTask = await prisma.clinicalTask.findUnique({
    where: { id: params.id },
    include: {
      patient: true,
    },
  });
  if (!clinicalTask) {
    return NextResponse.json({ error: 'Clinical task not found' }, { status: 404 });
  }
  return NextResponse.json(clinicalTask);
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const clinicalTask = await prisma.clinicalTask.update({
    where: { id: params.id },
    data: {
      description: data.description,
      status: data.status,
    },
  });
  return NextResponse.json(clinicalTask);
}

export async function DELETE(request, { params }) {
  await prisma.clinicalTask.delete({
    where: { id: params.id },
  });
  return NextResponse.json({ message: 'Clinical task deleted' });
}
