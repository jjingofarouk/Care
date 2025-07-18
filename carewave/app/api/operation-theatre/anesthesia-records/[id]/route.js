import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const anesthesiaRecord = await prisma.anesthesiaRecord.findUnique({
      where: { id: params.id },
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

    if (!anesthesiaRecord) {
      return NextResponse.json({ error: 'Anesthesia record not found' }, { status: 404 });
    }

    return NextResponse.json(anesthesiaRecord);
  } catch (error) {
    console.error('Error fetching anesthesia record:', error);
    return NextResponse.json({ error: 'Failed to fetch anesthesia record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();

    if (!data.type || !data.administeredAt) {
      return NextResponse.json(
        { error: 'Missing required fields: type, administeredAt' },
        { status: 400 }
      );
    }

    const anesthesiaRecord = await prisma.anesthesiaRecord.update({
      where: { id: params.id },
      data: {
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

    return NextResponse.json(anesthesiaRecord);
  } catch (error) {
    console.error('Error updating anesthesia record:', error);
    return NextResponse.json({ error: 'Failed to update anesthesia record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.anesthesiaRecord.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Anesthesia record deleted successfully' });
  } catch (error) {
    console.error('Error deleting anesthesia record:', error);
    return NextResponse.json({ error: 'Failed to delete anesthesia record' }, { status: 500 });
  }
}
