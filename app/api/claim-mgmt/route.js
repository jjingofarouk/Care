import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const claims = await prisma.claim.findMany();
    return NextResponse.json(claims);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const claim = await prisma.claim.create({ data });
    return NextResponse.json(claim, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 });
  }
}