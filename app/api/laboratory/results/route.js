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
            sample: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching lab results:', error);
    return NextResponse.json({ error: 'Failed to fetch lab results' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.labRequestId || !data.result || !data.resultedAt) {
      return NextResponse.json(
        { error: 'Missing required fields: labRequestId, result, resultedAt' },
        { status: 400 }
      );
    }

    // Verify lab request exists
    const labRequestExists = await prisma.labRequest.findUnique({
      where: { id: data.labRequestId },
    });

    if (!labRequestExists) {
      return NextResponse.json(
        { error: 'Lab request not found' },
        { status: 404 }
      );
    }

    // Check if result already exists for this lab request
    const existingResult = await prisma.labResult.findFirst({
      where: { labRequestId: data.labRequestId },
    });

    if (existingResult) {
      return NextResponse.json(
        { error: 'Result already exists for this lab request' },
        { status: 409 }
      );
    }

    // Create the lab result - Note: labRequestId is a string, not integer
    const result = await prisma.labResult.create({
      data: {
        labRequestId: data.labRequestId, // Keep as string
        result: data.result,
        resultedAt: new Date(data.resultedAt),
      },
      include: {
        labRequest: {
          include: {
            patient: true,
            labTest: true,
            sample: true,
          },
        },
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating lab result:', error);
    return NextResponse.json(
      { error: 'Failed to create lab result: ' + error.message },
      { status: 500 }
    );
  }
}