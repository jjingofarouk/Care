import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;
  const schedule = await prisma.doctorSchedule.findUnique({
    where: { id },
    include: { doctor: true },
  });
  return NextResponse.json(schedule || {});
}

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.json();

  const schedule = await prisma.doctorSchedule.update({
    where: { id },
    data: {
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      dayOfWeek: data.dayOfWeek,
    },
  });
  return NextResponse.json(schedule);
}

export async function DELETE(request, { params }) {
  const { id } = params;
  await prisma.doctorSchedule.delete({ where: { id } });
  return NextResponse.json({ message: 'Schedule deleted' });
}