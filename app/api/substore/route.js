import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const substoreRecords = await prisma.substoreRecord.findMany();
    return NextResponse.json(substoreRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch substore records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const substoreRecord = await prisma.substoreRecord.create({ data });
    return NextResponse.json(substoreRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create substore record' }, { status: 500 });
  }
}