import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const referrals = await prisma.referral.findMany();
    return NextResponse.json(referrals);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const referral = await prisma.referral.create({ data });
    return NextResponse.json(referral, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create referral' }, { status: 500 });
  }
}