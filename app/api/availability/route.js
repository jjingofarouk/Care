import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const doctorId = parseInt(searchParams.get('doctorId'), 10);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const where = {};
    if (doctorId) where.doctorId = doctorId;
    if (startDate && endDate) {
      where.startTime = { gte: new Date(startDate) };
      where.endTime = { lte: new Date(endDate) };
    }

    const availability = await prisma.doctorAvailability.findMany({
      where,
      include: { doctor: { include: { user: true } } },
    });
    return NextResponse.json(availability);
  } catch (error) {
    console.error('GET /api/availability error:', error);
    return NextResponse.json({ error: 'Failed to fetch availability', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.doctorId || !data.startTime || !data.endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const availability = await prisma.doctorAvailability.create({
      data: {
        doctor: { connect: { id: parseInt(data.doctorId) } },
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        status: data.status || 'AVAILABLE',
      },
      include: { doctor: { include: { user: true } } },
    });

    return NextResponse.json(availability, { status: 201 });
  } catch (error) {
    console.error('POST /api/availability error:', error);
    return NextResponse.json({ error: 'Failed to create availability', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
