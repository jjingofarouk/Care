import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const radiologyRecord = await prisma.radiologyRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!radiologyRecord) {
      return NextResponse.json({ error: 'Radiology record not found' }, { status: 404 });
    }
    return NextResponse.json(radiologyRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch radiology record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const radiologyRecord = await prisma.radiologyRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(radiologyRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update radiology record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.radiologyRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Radiology record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete radiology record' }, { status: 500 });
  }
}