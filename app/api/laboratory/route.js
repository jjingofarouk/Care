import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const labRecords = await prisma.labRecord.findMany();
    return NextResponse.json(labRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lab records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const labRecord = await prisma.labRecord.create({ data });
    return NextResponse.json(labRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lab record' }, { status: 500 });
  }
}