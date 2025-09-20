// app/api/vaccination/vaccines/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const vaccines = await prisma.vaccine.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(vaccines);
  } catch (error) {
    console.error('Error fetching vaccines:', error);
    return NextResponse.json({ error: 'Error fetching vaccines' }, { status: 500 });
  }
}
