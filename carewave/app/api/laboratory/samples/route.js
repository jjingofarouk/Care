import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const samples = await prisma.sample.findMany({
      include: {
        patient: true,
      },
    });
    return NextResponse.json(samples);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch samples' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const sample = await prisma.sample.create({
      data: {
        patientId: parseInt(data.patientId),
        sampleType: data.sampleType,
        collectedAt: new Date(data.collectedAt),
      },
    });
    return NextResponse.json(sample);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create sample' }, { status: 500 });
  }
}
