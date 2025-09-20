import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const procurementRecords = await prisma.procurementRecord.findMany();
    return NextResponse.json(procurementRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch procurement records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const procurementRecord = await prisma.procurementRecord.create({ data });
    return NextResponse.json(procurementRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create procurement record' }, { status: 500 });
  }
}