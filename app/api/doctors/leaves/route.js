import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get('doctorId');

  const leaves = await prisma.doctorLeave.findMany({
    where: doctorId ? { doctorId } : {},
    include: { doctor: true },
  });
  return NextResponse.json(leaves);
}

export async function POST(request) {
  const data = await request.json();
  const leave = await prisma.doctorLeave.create({
    data: {
      doctorId: data.doctorId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      reason: data.reason,
    },
  });
  return NextResponse.json(leave, { status: 201 });
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
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

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  await prisma.doctorLeave.delete({ where: { id } });
  return NextResponse.json({ message: 'Leave deleted' });
}