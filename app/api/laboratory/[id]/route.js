import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const labRecord = await prisma.labRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!labRecord) {
      return NextResponse.json({ error: 'Lab record not found' }, { status: 404 });
    }
    return NextResponse.json(labRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lab record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const labRecord = await prisma.labRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(labRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lab record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.labRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Lab record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lab record' }, { status: 500 });
  }
}