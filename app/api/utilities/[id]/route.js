import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const utilityRecord = await prisma.utilityRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!utilityRecord) {
      return NextResponse.json({ error: 'Utility record not found' }, { status: 404 });
    }
    return NextResponse.json(utilityRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch utility record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const utilityRecord = await prisma.utilityRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(utilityRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update utility record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.utilityRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Utility record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete utility record' }, { status: 500 });
  }
}