// app/api/radiology/tests/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const test = await prisma.radiologyTest.findUnique({
      where: { id: params.id },
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

    if (!test) {
      return NextResponse.json(
        { error: 'Radiology test not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(test);
  } catch (error) {
    console.error('Error fetching radiology test:', error);
    return NextResponse.json(
      { error: 'Failed to fetch radiology test' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    
    if (!data.name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const existingTest = await prisma.radiologyTest.findUnique({
      where: { id: params.id },
    });

    if (!existingTest) {
      return NextResponse.json(
        { error: 'Radiology test not found' },
        { status: 404 }
      );
    }

    const test = await prisma.radiologyTest.update({
      where: { id: params.id },
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

    return NextResponse.json(test);
  } catch (error) {
    console.error('Error updating radiology test:', error);
    return NextResponse.json(
      { error: 'Failed to update radiology test' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const orders = await prisma.imagingOrder.count({
      where: { radiologyTestId: params.id },
    });

    if (orders > 0) {
      return NextResponse.json(
        { error: 'Cannot delete test with associated orders' },
        { status: 400 }
      );
    }

    await prisma.radiologyTest.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Radiology test deleted successfully' });
  } catch (error) {
    console.error('Error deleting radiology test:', error);
    return NextResponse.json(
      { error: 'Failed to delete radiology test' },
      { status: 500 }
    );
  }
}
