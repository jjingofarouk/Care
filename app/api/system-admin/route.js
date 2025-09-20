import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const adminRecords = await prisma.adminRecord.findMany();
    return NextResponse.json(adminRecords);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const adminRecord = await prisma.adminRecord.create({ data });
    return NextResponse.json(adminRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create admin record' }, { status: 500 });
  }
}