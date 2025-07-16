// app/api/vaccination/schedules/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const schedules = await prisma.immunizationSchedule.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Error fetching schedules' }, { status: 500 });
  }
  }