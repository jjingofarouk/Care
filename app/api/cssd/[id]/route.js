import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const cssdRecord = await prisma.cssdRecord.findUnique({
      where: { id: parseInt(params.id) },
      include: { instrument: true },
    });
    if (!cssdRecord) {
      return NextResponse.json({ error: 'CSSD record not found' }, { status: 404 });
    }
    return NextResponse.json(cssdRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch CSSD record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const cssdRecord = await prisma.cssdRecord.update({
      where: { id: parseInt(params.id) },
      data: {
        instrumentId: parseInt(data.instrumentId),
        sterilizationDate: data.sterilizationDate ? new Date(data.sterilizationDate) : null,
        sterilizationMethod: data.sterilizationMethod,
        cycleNumber: data.cycleNumber,
        status: data.status,
        qualityCheck: data.qualityCheck,
        notes: data.notes,
      },
    });
    await prisma.cssdLog.create({
      data: {
        recordId: cssdRecord.id,
        action: 'UPDATED',
        details: `CSSD record updated for instrument ${data.instrumentId}`,
        performedBy: data.userId || 1,
      },
    });
    return NextResponse.json(cssdRecord);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update CSSD record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await prisma.cssdRecord.delete({
      where: { id: parseInt(params.id) },
    });
    await prisma.cssdLog.create({
      data: {
        recordId: parseInt(params.id),
        action: 'DELETED',
        details: `CSSD record ${params.id} deleted`,
        performedBy: 1,
      },
    });
    return NextResponse.json({ message: 'CSSD record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete CSSD record' }, { status: 500 });
  }
}