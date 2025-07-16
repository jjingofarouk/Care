import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const results = await prisma.labResult.findMany({
      include: {
        labRequest: {
          include: {
            patient: true,
            labTest: true,
          },
        },
      },
    });
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lab results' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const result = await prisma.labResult.create({
      data: {
        labRequestId: parseInt(data.labRequestId),
        result: data.result,
        resultedAt: new Date(data.resultedAt),
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lab result' }, { status: 500 });
  }
}
