import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const bills = await prisma.bill.findMany();
    return NextResponse.json(bills);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bills' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const bill = await prisma.bill.create({ data });
    return NextResponse.json(bill, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create bill' }, { status: 500 });
  }
}