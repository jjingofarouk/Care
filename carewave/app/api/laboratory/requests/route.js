import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const requests = await prisma.labRequest.findMany({
      include: {
        patient: true,
        labTest: true,
        sample: true,
      },
    });
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lab requests' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const requestData = {
      patientId: parseInt(data.patientId),
      labTestId: parseInt(data.labTestId),
      sampleId: data.sampleId ? parseInt(data.sampleId) : null,
      requestedAt: new Date(data.requestedAt),
    };
    const labRequest = await prisma.labRequest.create({
      data: requestData,
    });
    return NextResponse.json(labRequest);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lab request' }, { status: 500 });
  }
}
