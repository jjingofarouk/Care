import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const dispensaryRecords = await prisma.dispensaryRecord.findMany();
    return NextResponse.json(dispensaryRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dispensary records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const dispensaryRecord = await prisma.dispensaryRecord.create({ data });
    return NextResponse.json(dispensaryRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create dispensary record' }, { status: 500 });
  }
}