import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const verificationRecords = await prisma.verificationRecord.findMany();
    return NextResponse.json(verificationRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch verification records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const verificationRecord = await prisma.verificationRecord.create({ data });
    return NextResponse.json(verificationRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create verification record' }, { status: 500 });
  }
}