import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const incentives = await prisma.incentive.findMany();
    return NextResponse.json(incentives);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch incentives' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const incentive = await prisma.incentive.create({ data });
    return NextResponse.json(incentive, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create incentive' }, { status: 500 });
  }
}