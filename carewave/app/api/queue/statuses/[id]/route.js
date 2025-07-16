import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const queueStatus = await prisma.queueStatus.findUnique({
      where: { id: params.id },
    });

    if (!queueStatus) {
      return NextResponse.json(
        { error: 'Queue status not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(queueStatus);
  } catch (error) {
    console.error('GET /api/queue/statuses/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch queue status', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();

    if (!data.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const queueStatus = await prisma.queueStatus.update({
      where: { id: params.id },
      data: {
        name: data.name,
      },
    });

    return NextResponse.json(queueStatus);
  } catch (error) {
    console.error('PUT /api/queue/statuses/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update queue status', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.queueStatus.delete({
      where: { id: params.id },
    });

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    console.error('DELETE /api/queue/statuses/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete queue status', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
