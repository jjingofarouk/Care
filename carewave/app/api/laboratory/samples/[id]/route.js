import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const sample = await prisma.sample.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        patient: true,
      },
    });
    if (!sample) return NextResponse.json({ error: 'Sample not found' }, { status: 404 });
    return NextResponse.json(sample);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sample' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const sample = await prisma.sample.update({
      where: { id: parseInt(params.id) },
      data: {
        sampleType: data.sampleType,
        collectedAt: new Date(data.collectedAt),
      },
    });
    return NextResponse.json(sample);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update sample' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.sample.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Sample deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sample' }, { status: 500 });
  }
}
