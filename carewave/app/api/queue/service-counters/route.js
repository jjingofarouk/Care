import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }

    const serviceCounters = await prisma.serviceCounter.findMany({
      where,
      include: {
        department: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(serviceCounters);
  } catch (error) {
    console.error('GET /api/queue/service-counters error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service counters', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name || !data.departmentId) {
      return NextResponse.json(
        { error: 'Name and department ID are required' },
        { status: 400 }
      );
    }

    const serviceCounter = await prisma.serviceCounter.create({
      data: {
        name: data.name,
        departmentId: data.departmentId,
      },
      include: {
        department: true,
      },
    });

    return NextResponse.json(serviceCounter, { status: 201 });
  } catch (error) {
    console.error('POST /api/queue/service-counters error:', error);
    return NextResponse.json(
      { error: 'Failed to create service counter', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
