import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const doctorCount = await prisma.doctor.count();

    const hasData = userCount > 0 || doctorCount > 0;

    return NextResponse.json({
      hasData,
      userCount,
      doctorCount,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}