// app/api/radiology/scan-images/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  try {
    const scanImages = await prisma.scanImage.findMany({
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
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.scanImage.count();

    return NextResponse.json({ scanImages, total });
  } catch (error) {
    console.error('Error fetching scan images:', error);
    return NextResponse.json({ error: 'Failed to fetch scan images' }, { status: 500 });
  }
}

export async function POST(request) {
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

    const scanImage = await prisma.scanImage.create({
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

    return NextResponse.json(scanImage, { status: 201 });
  } catch (error) {
    console.error('Error creating scan image:', error);
    return NextResponse.json(
      { error: 'Failed to create scan image' },
      { status: 500 }
    );
  }
}
