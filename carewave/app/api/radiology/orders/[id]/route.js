// app/api/radiology/orders/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const order = await prisma.imagingOrder.findUnique({
      where: { id: params.id },
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
            result: true,
            resultedAt: true,
            scanImages: {
              select: {
                id: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Imaging order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching imaging order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch imaging order' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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

    const order = await prisma.imagingOrder.update({
      where: { id: params.id },
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

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating imaging order:', error);
    return NextResponse.json(
      { error: 'Failed to update imaging order' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.imagingOrder.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Imaging order deleted successfully' });
  } catch (error) {
    console.error('Error deleting imaging order:', error);
    return NextResponse.json(
      { error: 'Failed to delete imaging order' },
      { status: 500 }
    );
  }
}
