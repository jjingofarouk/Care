// app/api/radiology/tests/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || '';

  try {
    const tests = await prisma.radiologyTest.findMany({
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
      include: {
        imagingOrders: {
          select: {
            id: true,
            orderedAt: true,
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.radiologyTest.count({
      where: {
        name: { contains: search, mode: 'insensitive' },
      },
    });

    return NextResponse.json({ tests, total });
  } catch (error) {
    console.error('Error fetching radiology tests:', error);
    return NextResponse.json({ error: 'Failed to fetch radiology tests' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const existingTest = await prisma.radiologyTest.findUnique({
      where: { name: data.name },
    });

    if (existingTest) {
      return NextResponse.json(
        { error: 'Test with this name already exists' },
        { status: 400 }
      );
    }

    const test = await prisma.radiologyTest.create({
      data: {
        name: data.name,
        description: data.description,
      },
      include: {
        imagingOrders: {
          select: {
            id: true,
            orderedAt: true,
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error('Error creating radiology test:', error);
    return NextResponse.json(
      { error: 'Failed to create radiology test' },
      { status: 500 }
    );
  }
}
