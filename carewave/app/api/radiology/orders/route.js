// app/api/radiology/orders/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || '';

  try {
    const orders = await prisma.imagingOrder.findMany({
      where: {
        OR: [
          { patient: { firstName: { contains: search, mode: 'insensitive' } } },
          { patient: { lastName: { contains: search, mode: 'insensitive' } } },
          { radiologyTest: { name: { contains: search, mode: 'insensitive' } } },
        ],
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        radiologyTest: {
          select: {
            id: true,
            name: true,
          },
        },
        radiologyResults: {
          select: {
            id: true,
            resultedAt: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { orderedAt: 'desc' },
    });

    const total = await prisma.imagingOrder.count({
      where: {
        OR: [
          { patient: { firstName: { contains: search, mode: 'insensitive' } } },
          { patient: { lastName: { contains: search, mode: 'insensitive' } } },
          { radiologyTest: { name: { contains: search, mode: 'insensitive' } } },
        ],
      },
    });

    return NextResponse.json({ orders, total });
  } catch (error) {
    console.error('Error fetching imaging orders:', error);
    return NextResponse.json({ error: 'Failed to fetch imaging orders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.patientId || !data.radiologyTestId || !data.orderedAt) {
      return NextResponse.json(
        { error: 'Missing required fields: patientId, radiologyTestId, orderedAt' },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { id: data.patientId },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    const test = await prisma.radiologyTest.findUnique({
      where: { id: data.radiologyTestId },
    });

    if (!test) {
      return NextResponse.json(
        { error: 'Radiology test not found' },
        { status: 404 }
      );
    }

    const order = await prisma.imagingOrder.create({
      data: {
        patientId: data.patientId,
        radiologyTestId: data.radiologyTestId,
        orderedAt: new Date(data.orderedAt),
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        radiologyTest: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating imaging order:', error);
    return NextResponse.json(
      { error: 'Failed to create imaging order' },
      { status: 500 }
    );
  }
}
