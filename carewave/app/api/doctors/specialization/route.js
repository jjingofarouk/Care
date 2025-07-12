import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;
  const specialization = await prisma.specialization.findUnique({
    where: { id },
    include: { doctors: { include: { doctor: true } } },
  });
  return NextResponse.json(specialization || {});
}

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();

  const specialization = await prisma.specialization.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
  });
  return NextResponse.json(specialization);
}

export async function DELETE(request, { params }) {
  const { id } = params;
  await prisma.specialization.delete({ where: { id } });
  return NextResponse.json({ message: 'Specialization deleted' });
}