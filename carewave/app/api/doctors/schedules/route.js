import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get('doctorId');

  const schedules = await prisma.doctorSchedule.findMany({
    where: doctorId ? { doctorId } : {},
    include: { doctor: true },
  });
  return NextResponse.json(schedules);
}

export async function POST(request) {
  const data = await request.json();
  const schedule = await prisma.doctorSchedule.create({
    data: {
      doctorId: data.doctorId,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      dayOfWeek: data.dayOfWeek,
    },
  });
  return NextResponse.json(schedule, { status: 201 });
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
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

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  await prisma.doctorSchedule.delete({ where: { id } });
  return NextResponse.json({ message: 'Schedule deleted' });
}