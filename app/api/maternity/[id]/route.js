import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const maternityRecord = await prisma.maternityRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!maternityRecord) {
      return NextResponse.json({ error: 'Maternity record not found' }, { status: 404 });
    }
    return NextResponse.json(maternityRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch maternity record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const maternityRecord = await prisma.maternityRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(maternityRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update maternity record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.maternityRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Maternity record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete maternity record' }, { status: 500 });
  }
}