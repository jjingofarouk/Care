import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cssdRecords = await prisma.cssdRecord.findMany({
      include: { instrument: true },
    });
    return NextResponse.json(cssdRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch CSSD records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const cssdRecord = await prisma.cssdRecord.create({
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
        action: 'CREATED',
        details: `CSSD record created for instrument ${data.instrumentId}`,
        performedBy: data.userId || 1,
      },
    });
    return NextResponse.json(cssdRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create CSSD record' }, { status: 500 });
  }
}