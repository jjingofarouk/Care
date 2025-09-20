import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const clinicalRecords = await prisma.clinicalRecord.findMany();
    return NextResponse.json(clinicalRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch clinical records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const clinicalRecord = await prisma.clinicalRecord.create({ data });
    return NextResponse.json(clinicalRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create clinical record' }, { status: 500 });
  }
}