import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const operationRecords = await prisma.operationRecord.findMany();
    return NextResponse.json(operationRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch operation records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const operationRecord = await prisma.operationRecord.create({ data });
    return NextResponse.json(operationRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create operation record' }, { status: 500 });
  }
}