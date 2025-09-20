import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const nursingRecords = await prisma.nursingRecord.findMany();
    return NextResponse.json(nursingRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch nursing records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const nursingRecord = await prisma.nursingRecord.create({ data });
    return NextResponse.json(nursingRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create nursing record' }, { status: 500 });
  }
}