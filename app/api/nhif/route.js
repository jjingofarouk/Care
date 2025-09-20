import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const nhifRecords = await prisma.nhifRecord.findMany();
    return NextResponse.json(nhifRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch NHIF records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const nhifRecord = await prisma.nhifRecord.create({ data });
    return NextResponse.json(nhifRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create NHIF record' }, { status: 500 });
  }
}