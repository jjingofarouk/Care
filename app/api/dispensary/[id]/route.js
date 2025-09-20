import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const dispensaryRecord = await prisma.dispensaryRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!dispensaryRecord) {
      return NextResponse.json({ error: 'Dispensary record not found' }, { status: 404 });
    }
    return NextResponse.json(dispensaryRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dispensary record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const dispensaryRecord = await prisma.dispensaryRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(dispensaryRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update dispensary record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.dispensaryRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Dispensary record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete dispensary record' }, { status: 500 });
  }
}