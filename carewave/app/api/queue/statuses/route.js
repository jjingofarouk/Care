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

    const queueStatuses = await prisma.queueStatus.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(queueStatuses);
  } catch (error) {
    console.error('GET /api/queue/statuses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue statuses', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const queueStatus = await prisma.queueStatus.create({
      data: {
        name: data.name,
      },
    });

    return NextResponse.json(queueStatus, { status: 201 });
  } catch (error) {
    console.error('POST /api/queue/statuses error:', error);
    return NextResponse.json(
      { error: 'Failed to create queue status', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
