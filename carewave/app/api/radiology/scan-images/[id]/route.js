// app/api/radiology/scan-images/[id]/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const scanImage = await prisma.scanImage.findUnique({
      where: { id: params.id },
      include: {
        radiologyResult: {
          select: {
            id: true,
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
              },
            },
          },
        },
      },
    });

    if (!scanImage) {
      return NextResponse.json(
        { error: 'Scan image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(scanImage);
  } catch (error) {
    console.error('Error fetching scan image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scan image' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    
    if (!data.radiologyResultId || !data.imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: radiologyResultId, imageUrl' },
        { status: 400 }
      );
    }

    const result = await prisma.radiologyResult.findUnique({
      where: { id: data.radiologyResultId },
    });

    if (!result) {
      return NextResponse.json(
        { error: 'Radiology result not found' },
        { status: 404 }
      );
      }

    const scanImage = await prisma.scanImage.update({
      where: { id: params.id },
      data: {
        radiologyResultId: data.radiologyResultId,
        imageUrl: data.imageUrl,
      },
      include: {
        radiologyResult: {
          select: {
            id: true,
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
              },
            },
          },
        },
      },
    });

    return NextResponse.json(scanImage);
  } catch (error) {
    console.error('Error updating scan image:', error);
    return NextResponse.json(
      { error: 'Failed to update scan image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.scanImage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Scan image deleted successfully' });
  } catch (error) {
    console.error('Error deleting scan image:', error);
    return NextResponse.json(
      { error: 'Failed to delete scan image' },
      { status: 500 }
    );
  }
}
