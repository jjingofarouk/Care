import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const procurementRecord = await prisma.procurementRecord.findUnique({
      where: { id: parseInt(params.id) },
    });
    if (!procurementRecord) {
      return NextResponse.json({ error: 'Procurement record not found' }, { status: 404 });
    }
    return NextResponse.json(procurementRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch procurement record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const procurementRecord = await prisma.procurementRecord.update({
      where: { id: parseInt(params.id) },
      data,
    });
    return NextResponse.json(procurementRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update procurement record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.procurementRecord.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ message: 'Procurement record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete procurement record' }, { status: 500 });
  }
}