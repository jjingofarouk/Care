// app/api/radiology/results/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || '';

  try {
    const results = await prisma.radiologyResult.findMany({
      where: {
        result: { contains: search, mode: 'insensitive' },
      },
      include: {
        imagingOrder: {
          select: {
            id: true,
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
        },
        scanImages: {
          select: {
            id: true,
            imageUrl: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { resultedAt: 'desc' },
    });

    const total = await prisma.radiologyResult.count({
      where: {
        result: { contains: search, mode: 'insensitive' },
      },
    });

    return NextResponse.json({ results, total });
  } catch (error) {
    console.error('Error fetching radiology results:', error);
    return NextResponse.json({ error: 'Failed to fetch radiology results' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.imagingOrderId || !data.result || !data.resultedAt) {
      return NextResponse.json(
        { error: 'Missing required fields: imagingOrderId, result, resultedAt' },
        { status: 400 }
      );
    }

    const order = await prisma.imagingOrder.findUnique({
      where: { id: data.imagingOrderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Imaging order not found' },
        { status: 404 }
      );
    }

    const result = await prisma.radiologyResult.create({
      data: {
        imagingOrderId: data.imagingOrderId,
        result: data.result,
        resultedAt: new Date(data.resultedAt),
      },
      include: {
        imagingOrder: {
          select: {
            id: true,
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
        },
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating radiology result:', error);
    return NextResponse.json(
      { error: 'Failed to create radiology result' },
      { status: 500 }
    );
  }
}
