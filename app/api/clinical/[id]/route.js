import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const clinicalRecord = await prisma.clinicalRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!clinicalRecord) {
      return NextResponse.json({ error: 'Clinical record not found' }, { status: 404 });
    }
    return NextResponse.json(clinicalRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch clinical record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const clinicalRecord = await prisma.clinicalRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(clinicalRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update clinical record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.clinicalRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Clinical record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete clinical record' }, { status: 500 });
  }
}