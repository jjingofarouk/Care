import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tests = await prisma.labTest.findMany();
    return NextResponse.json(tests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lab tests' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const test = await prisma.labTest.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lab test' }, { status: 500 });
  }
}
