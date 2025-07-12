import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;
  const leave = await prisma.doctorLeave.findUnique({
    where: { id },
    include: { doctor: true },
  });
  return NextResponse.json(leave || {});
}

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();

  const leave = await prisma.doctorLeave.update({
    where: { id },
    data: {
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      reason: data.reason,
    },
  });
  return NextResponse.json(leave);
}

export async function DELETE(request, { params }) {
  const { id } = params;
  await prisma.doctorLeave.delete({ where: { id } });
  return NextResponse.json({ message: 'Leave deleted' });
}