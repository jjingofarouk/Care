// app/api/vaccination/schedules/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const schedules = await prisma.immunizationSchedule.findMany();
    return NextResponse.json(schedules);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching schedules' }, { status: 500 });
  }
}
