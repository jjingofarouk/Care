import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const schedules = await prisma.depreciationSchedule.findMany();
    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch depreciation schedules' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const schedule = await prisma.depreciationSchedule.create({
      data: {
        fixedAssetId: data.fixedAssetId,
        depreciationDate: new Date(data.depreciationDate),
        amount: parseFloat(data.amount),
      },
    });
    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create depreciation schedule' }, { status: 500 });
  }
}