import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const search = searchParams.get('search') || '';

  try {
    const anesthesiaRecords = await prisma.anesthesiaRecord.findMany({
      where: {
        type: { contains: search, mode: 'insensitive' },
      },
      include: {
        surgery: {
          include: {
            patient: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.anesthesiaRecord.count({
      where: {
        type: { contains: search, mode: 'insensitive' },
      },
    });

    return NextResponse.json({ anesthesiaRecords, total });
  } catch (error) {
    console.error('Error fetching anesthesia records:', error);
    return NextResponse.json({ error: 'Failed to fetch anesthesia records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.surgeryId || !data.type || !data.administeredAt) {
      return NextResponse.json(
        { error: 'Missing required fields: surgeryId, type, administeredAt' },
        { status: 400 }
      );
    }

    const anesthesiaRecord = await prisma.anesthesiaRecord.create({
      data: {
        surgeryId: data.surgeryId,
        type: data.type,
        notes: data.notes,
        administeredAt: new Date(data.administeredAt),
      },
      include: {
        surgery: {
          include: {
            patient: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    return NextResponse.json(anesthesiaRecord, { status: 201 });
  } catch (error) {
    console.error('Error creating anesthesia record:', error);
    return NextResponse.json(
      { error: 'Failed to create anesthesia record' },
      { status: 500 }
    );
  }
}
