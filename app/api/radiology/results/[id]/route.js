// app/api/radiology/results/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const result = await prisma.radiologyResult.findUnique({
      where: { id: params.id },
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
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Radiology result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching radiology result:', error);
    return NextResponse.json(
      { error: 'Failed to fetch radiology result' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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

    const result = await prisma.radiologyResult.update({
      where: { id: params.id },
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

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating radiology result:', error);
    return NextResponse.json(
      { error: 'Failed to update radiology result' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.radiologyResult.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Radiology result deleted successfully' });
  } catch (error) {
    console.error('Error deleting radiology result:', error);
    return NextResponse.json(
      { error: 'Failed to delete radiology result' },
      { status: 500 }
    );
  }
}
