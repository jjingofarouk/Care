import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const radiologyRecords = await prisma.radiologyRecord.findMany();
    return NextResponse.json(radiologyRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch radiology records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const radiologyRecord = await prisma.radiologyRecord.create({ data });
    return NextResponse.json(radiologyRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create radiology record' }, { status: 500 });
  }
}