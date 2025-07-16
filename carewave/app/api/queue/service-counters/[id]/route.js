import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const serviceCounter = await prisma.serviceCounter.findUnique({
      where: { id: params.id },
      include: {
        department: true,
      },
    });

    if (!serviceCounter) {
      return NextResponse.json(
        { error: 'Service counter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(serviceCounter);
  } catch (error) {
    console.error('GET /api/queue/service-counters/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service counter', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();

    if (!data.name || !data.departmentId) {
      return NextResponse.json(
        { error: 'Name and department ID are required' },
        { status: 400 }
      );
    }

    const serviceCounter = await prisma.serviceCounter.update({
      where: { id: params.id },
      data: {
        name: data.name,
        departmentId: data.departmentId,
      },
      include: {
        department: true,
      },
    });

    return NextResponse.json(serviceCounter);
  } catch (error) {
    console.error('PUT /api/queue/service-counters/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update service counter', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.serviceCounter.delete({
      where: { id: params.id },
    });

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    console.error('DELETE /api/queue/service-counters/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete service counter', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
