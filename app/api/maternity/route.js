import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const maternityRecords = await prisma.maternityRecord.findMany();
    return NextResponse.json(maternityRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch maternity records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const maternityRecord = await prisma.maternityRecord.create({ data });
    return NextResponse.json(maternityRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create maternity record' }, { status: 500 });
  }
}