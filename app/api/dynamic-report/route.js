import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const reports = await prisma.dynamicReport.findMany();
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const report = await prisma.dynamicReport.create({ data });
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}