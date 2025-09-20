import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const socialServiceRecords = await prisma.socialServiceRecord.findMany();
    return NextResponse.json(socialServiceRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch social service records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const socialServiceRecord = await prisma.socialServiceRecord.create({ data });
    return NextResponse.json(socialServiceRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create social service record' }, { status: 500 });
  }
}