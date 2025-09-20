import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const utilityRecords = await prisma.utilityRecord.findMany();
    return NextResponse.json(utilityRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch utility records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const utilityRecord = await prisma.utilityRecord.create({ data });
    return NextResponse.json(utilityRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create utility record' }, { status: 500 });
  }
}